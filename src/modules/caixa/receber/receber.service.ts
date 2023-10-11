import { BadRequestException, Injectable } from '@nestjs/common';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoFrete } from 'src/commons/enum/tipo-frete';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { ContextService } from 'src/context/context.service';
import { ConsignacaoService } from 'src/modules/consignacao/consignacao.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';
import { CreateFaturaAutimaticaDto } from 'src/modules/fatura/dto/create-fatura-automatica.dto';
import { FaturaEntity } from 'src/modules/fatura/entities/fatura.entity';
import { FaturaService } from 'src/modules/fatura/fatura.service';
import { FaturaParcelaEntity } from 'src/modules/fatura/parcela/entities/parcela.entity';
import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';
import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';
import { ModalidadeRomaneio } from 'src/modules/romaneio/enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from 'src/modules/romaneio/enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';
import { RomaneioView } from 'src/modules/romaneio/views/romaneio.view';

import { CaixaExtratoEntity } from '../extrato/entities/extrato.entity';
import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { CaixaExtratoService } from '../extrato/extrato.service';
import { PagamentoDto } from './dto/pagamento.dto';
import { ReceberAdiantamentoDto } from './dto/receber-adiantamento.dto';
import { ReceberFaturaDto } from './dto/receber-fatura.dto';
import { ReceberRomaneioDto } from './dto/receber-romaneio.dto';
import { RecebimentoDto } from './dto/recebimento.dto';

@Injectable()
export class ReceberService {
  constructor(
    private readonly contextService: ContextService,
    private readonly formaDePagamentoService: FormaDePagamentoService,
    private readonly pessoaExtratoService: PessoaExtratoService,
    private readonly faturaService: FaturaService,
    private readonly caixaExtratoService: CaixaExtratoService,
    private readonly romaneioService: RomaneioService,
    private readonly estoqueService: EstoqueService,
    private readonly consignacaoService: ConsignacaoService
  ) {}

  async adiantamento(caixaId: number, { formasDePagamento, ...recebimento }: ReceberAdiantamentoDto): Promise<CaixaExtratoEntity[]> {
    const empresaId = this.contextService.empresaId();

    const faturas = await this.lancarFaturas(empresaId, recebimento, formasDePagamento);
    const liquidacao = await this.lancarNoCaixa(caixaId, TipoHistorico.Adiantamento, faturas);

    return liquidacao;
  }

  async fatura(caixaId: number, faturaDto: ReceberFaturaDto): Promise<FaturaEntity> {
    return;
  }

  async romaneio(caixaId: number, romaneioDto: ReceberRomaneioDto): Promise<RomaneioView> {
    const empresa = this.contextService.empresa();
    const parametros = this.contextService.parametros();

    const romaneio = await this.romaneioService.findById(empresa.id, romaneioDto.romaneioId, ['itens']);
    if (!romaneio) {
      throw new BadRequestException('Romaneio não encontrado');
    } else if (romaneio.itens.length == 0) {
      throw new BadRequestException('Romaneio não possui itens');
    } else if (romaneio.modalidade == ModalidadeRomaneio.saida) {
      const produtos = romaneio.itens
        .groupBy((x) => x.produtoId)
        .map((x) => ({ produtoId: x.key, quantidade: x.values.sum((y) => y.quantidade) }));

      const produtoIds = produtos.map((x) => x.produtoId);
      const estoque = await this.estoqueService.findByProdutoIds(empresa.id, produtoIds);

      const estInsuficiente = estoque.filter((x) => x.saldo < produtos.find((y) => y.produtoId == x.produtoId).quantidade);
      if (estInsuficiente.length > 0) {
        throw new BadRequestException(`Estoque insuficiente para os produtos: ${estInsuficiente.map((x) => x.produtoId).join(', ')}`);
      }
    } else if (romaneio.operacao == OperacaoRomaneio.consignacao_saida && !romaneio.consignacaoId) {
      throw new BadRequestException('Consignação não informada');
    } else if (romaneio.operacao == OperacaoRomaneio.consignacao_devolucao && !romaneio.consignacaoId) {
      throw new BadRequestException('Consignação não informada');
    } else if (romaneio.operacao == OperacaoRomaneio.consignacao_acerto && !romaneio.consignacaoId) {
      throw new BadRequestException('Consignação não informada');
    }

    let recebimento: RecebimentoDto;
    let faturas: FaturaEntity[];
    let extrato: CaixaExtratoEntity[];
    let liquidacaoId: number;

    switch (romaneio.operacao) {
      case OperacaoRomaneio.compra:
        throw new BadRequestException('Operação não implementada');

      case OperacaoRomaneio.compra_devolucao:
        throw new BadRequestException('Operação não implementada');

      case OperacaoRomaneio.venda:
        const valorRomaneioVenda = romaneio.valorLiquido + (romaneio.tipoFrete == TipoFrete.FOB ? romaneio.valorFrete : 0);

        if (!romaneioDto.formasDePagamento) {
          throw new BadRequestException('Nenhuma forma de pagamento informada');
        } else if (romaneio.situacao != SituacaoRomaneio.em_andamento) {
          throw new BadRequestException('Romaneio não está em andamento');
        } else if (valorRomaneioVenda > romaneioDto.formasDePagamento.sum((x) => x.valor)) {
          throw new BadRequestException('O valor pago é insuficiente para encerrar o romaneio');
        }
        recebimento = { pessoaId: romaneio.pessoaId, valor: romaneio.valorLiquido, romaneioId: romaneio.romaneioId };
        faturas = await this.lancarFaturas(empresa.id, recebimento, romaneioDto.formasDePagamento);
        extrato = await this.lancarNoCaixa(caixaId, TipoHistorico.Venda, faturas);
        liquidacaoId = extrato.first().liquidacao;

        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId, liquidacaoId);

      case OperacaoRomaneio.venda_devolucao:
        if (!romaneio.romaneiosDevolucao && parametros.first((x) => x.parametroId == 'DEVOLVER_SEM_ROMANEIO').valor == 'N') {
          throw new BadRequestException('Romaneios de devolução não informados');
        }

        if (!(await this.romaneioService.validarDevolucao(empresa.id, romaneio.romaneioId, ['venda'], romaneio.romaneiosDevolucao))) {
          throw new BadRequestException('Romaneio possui itens que não podem ser devolvidos');
        }

        const fatura = await this.faturaService.createAutomatica({
          pessoaId: romaneio.pessoaId,
          parcelas: 1,
          romaneioId: romaneio.romaneioId,
          valor: romaneio.valorLiquido,
          tipoDocumento: TipoDocumento.Credito_de_Devolucao,
          tipoMovimento: TipoMovimento.Credito,
          observacao: `Crédito de devolução gerado a partir do romaneio ${romaneio.romaneioId}`,
          itens: [{ parcela: 1, valor: romaneio.valorLiquido, caixaPagamento: caixaId, situacao: 'Encerrada' } as FaturaParcelaEntity],
        });

        await this.pessoaExtratoService.lancarMovimento({
          pessoaId: romaneio.pessoaId,
          faturaId: fatura.id,
          faturaParcela: fatura.itens.first().parcela,
          valor: romaneio.valorLiquido,
          liquidacao: await this.caixaExtratoService.newLiquidacaoId(),
          romaneioId: romaneio.romaneioId,
          tipoDocumento: TipoDocumento.Credito_de_Devolucao as any,
          tipoMovimento: TipoMovimento.Credito,
          observacao: `Crédito de devolução gerado a partir do romaneio ${romaneio.romaneioId}`,
        });

        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId);

      case OperacaoRomaneio.consignacao_saida:
        const consignacao = await this.consignacaoService.findById(empresa.id, romaneio.consignacaoId, ['itens']);
        if (!consignacao) {
          throw new BadRequestException('Consignação não encontrada');
        } else if (consignacao.situacao != 'em_andamento') {
          throw new BadRequestException('Consignação não está em andamento');
        }

        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId);

      case OperacaoRomaneio.consignacao_devolucao:
        // eslint-disable-next-line prettier/prettier
        if (!(await this.romaneioService.validarDevolucao(empresa.id, romaneio.romaneioId, ['consignacao_saida'], romaneio.romaneiosDevolucao))) {
          throw new BadRequestException('Romaneio possui itens que não podem ser devolvidos');
        }

        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId);

      case OperacaoRomaneio.consignacao_acerto:
        const valorRomaneioAcerto = romaneio.valorLiquido + (romaneio.tipoFrete == TipoFrete.FOB ? romaneio.valorFrete : 0);

        if (!romaneioDto.formasDePagamento) {
          throw new BadRequestException('Nenhuma forma de pagamento informada');
        } else if (romaneio.situacao != SituacaoRomaneio.em_andamento) {
          throw new BadRequestException('Romaneio não está em andamento');
        } else if (valorRomaneioAcerto > romaneioDto.formasDePagamento.sum((x) => x.valor)) {
          throw new BadRequestException('O valor pago é insuficiente para encerrar o romaneio');
        }

        recebimento = { pessoaId: romaneio.pessoaId, valor: romaneio.valorLiquido, romaneioId: romaneio.romaneioId };
        faturas = await this.lancarFaturas(empresa.id, recebimento, romaneioDto.formasDePagamento);
        extrato = await this.lancarNoCaixa(caixaId, TipoHistorico.Venda, faturas);
        liquidacaoId = extrato.first().liquidacao;

        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId, liquidacaoId);

      case OperacaoRomaneio.transferencia_saida:
        throw new BadRequestException('Operação não implementada');

      case OperacaoRomaneio.transferencia_entrada:
        throw new BadRequestException('Operação não implementada');

      case OperacaoRomaneio.outros:
        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId);
    }
  }

  async lancarNoCaixa(caixaId: number, tipoHistorico: TipoHistorico, faturas: FaturaEntity[]): Promise<CaixaExtratoEntity[]> {
    const liquidacaoId = await this.caixaExtratoService.newLiquidacaoId();

    const liquidacaoFatura = faturas
      .map(({ tipoDocumento, itens, observacao, tipoMovimento }) => {
        return itens.map(({ faturaId, parcela, valor }) => ({
          faturaId: faturaId,
          faturaParcela: parcela,
          tipoDocumento: tipoDocumento,
          tipoHistorico: tipoHistorico,
          tipoMovimento: tipoMovimento,
          valor: valor,
          observacao: observacao,
        }));
      })
      .flat();

    return this.caixaExtratoService.lancar(caixaId, liquidacaoId, liquidacaoFatura);
  }

  async lancarFaturas(empresaId: number, recebimento: RecebimentoDto, formasDePagamento: PagamentoDto[]): Promise<FaturaEntity[]> {
    const pagamentos = formasDePagamento
      .groupBy(({ controle, formaDePagamentoId }) => ({ controle, formaDePagamentoId }))
      .select((x) => ({
        pessoaId: recebimento.pessoaId,
        formaDePagamentoId: x.key.formaDePagamentoId,
        tipoMovimento: TipoMovimento.Credito,
        valor: x.values.sum((y) => y.valor),
        parcelas: x.values.length,
        observacao: recebimento.observacao,
        itens: x.values
          .groupBy((item) => item.parcela)
          .select((y) => ({
            ...y.values.first(),
            parcela: y.key,
            valor: y.values.sum((z) => z.valor),
          })) as any,
      }));

    const formasDePagamentos = await this.formaDePagamentoService.find();
    const tipoDocumentos = formasDePagamento
      .groupBy((x) => x.formaDePagamentoId)
      .select((x) => ({
        id: x.key,
        tipoDocumento: formasDePagamentos.first((b) => b.id == x.key).tipo,
        valor: x.values.sum((y) => y.valor),
      }));

    let faturaTroco: CreateFaturaAutimaticaDto = null;
    if (pagamentos.sum((x) => x.valor) < recebimento.valor) {
      throw new BadRequestException('Valor insuficiente para realizar o a operação.');
    } else if (pagamentos.sum((x) => x.valor) > recebimento.valor) {
      const valorTroco = pagamentos.sum((x) => x.valor) - recebimento.valor;
      const valorDinherio = tipoDocumentos.filter((x) => x.tipoDocumento == TipoDocumento.Dinheiro).sum((x) => x.valor);
      if (valorDinherio < valorTroco) {
        throw new BadRequestException('Valor em dinheiro insuficiente para realizar o a operação com troco.');
      } else {
        faturaTroco = {
          ...recebimento,
          valor: valorTroco,
          tipoMovimento: TipoMovimento.Debito,
          tipoDocumento: TipoDocumento.Troco,
          itens: [new FaturaParcelaEntity({ parcela: 1, valor: valorTroco })],
        };
      }
    }

    const adiantamento = tipoDocumentos.first((x) => x.tipoDocumento == TipoDocumento.Adiantamento);
    const saldoAdiantamento = await this.pessoaExtratoService.findSaldoAdiantamento(empresaId, recebimento.pessoaId);
    if (adiantamento && saldoAdiantamento < adiantamento.valor) {
      throw new BadRequestException('Saldo de adiantamento insuficiente para realizar o a operação.');
    }

    const creditoDeDevolucao = tipoDocumentos.first((x) => x.tipoDocumento == TipoDocumento.Credito_de_Devolucao);
    const saldoCreditoDeDevolucao = await this.pessoaExtratoService.findSaldoCreditoDeDevolucao(empresaId, recebimento.pessoaId);
    if (creditoDeDevolucao && saldoCreditoDeDevolucao < creditoDeDevolucao.valor) {
      throw new BadRequestException('Creditos de devolução insuficiente para realizar o a operação.');
    }

    const faturas: FaturaEntity[] = [];
    for await (const pagamento of pagamentos) {
      const formaDePagamento = formasDePagamentos.first((x) => x.id == pagamento.formaDePagamentoId);
      const fatura = await this.faturaService.createAutomatica({ ...pagamento, tipoDocumento: formaDePagamento.tipo });
      faturas.push(fatura);
    }

    if (faturaTroco) {
      const fatura = await this.faturaService.createAutomatica(faturaTroco);
      faturas.push(fatura);
    }

    return faturas;
  }
}
