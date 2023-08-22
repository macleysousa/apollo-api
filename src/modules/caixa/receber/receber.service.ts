import { BadRequestException, Injectable } from '@nestjs/common';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { ContextService } from 'src/context/context.service';
import { FaturaEntity } from 'src/modules/fatura/entities/fatura.entity';
import { FaturaService } from 'src/modules/fatura/fatura.service';
import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';
import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';
import { OperacaoRomaneio } from 'src/modules/romaneio/enum/operacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';
import { RomaneioView } from 'src/modules/romaneio/views/romaneio.view';
import { CreateFaturaAutimaticaDto } from 'src/modules/fatura/dto/create-fatura-automatica.dto';
import { FaturaParcelaEntity } from 'src/modules/fatura/parcela/entities/parcela.entity';

import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { CaixaExtratoService } from '../extrato/extrato.service';
import { PagamentoDto } from './dto/pagamento.dto';
import { ReceberAdiantamentoDto } from './dto/receber-adiantamento.dto';
import { ReceberFaturaDto } from './dto/receber-fatura.dto';
import { ReceberRomaneioDto } from './dto/receber-romaneio.dto';
import { RecebimentoDto } from './dto/recebimento.dto';
import { CaixaExtratoEntity } from '../extrato/entities/extrato.entity';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { TipoFrete } from 'src/commons/enum/tipo-frete';
import { ModalidadeRomaneio } from 'src/modules/romaneio/enum/modalidade-romaneio.enum';
import { EstoqueService } from 'src/modules/estoque/estoque.service';

@Injectable()
export class ReceberService {
  constructor(
    private readonly contextService: ContextService,
    private readonly formaDePagamentoService: FormaDePagamentoService,
    private readonly pessoaExtratoService: PessoaExtratoService,
    private readonly faturaService: FaturaService,
    private readonly caixaExtratoService: CaixaExtratoService,
    private readonly romaneioService: RomaneioService,
    private readonly estoqueService: EstoqueService
  ) {}

  async adiantamento(caixaId: number, { formasDePagamento, ...recebimento }: ReceberAdiantamentoDto): Promise<CaixaExtratoEntity[]> {
    const empresaId = this.contextService.empresaId();

    const faturas = await this.lancarFaturas(empresaId, recebimento, formasDePagamento);
    const liquidacao = await this.lancarLiquidacao(caixaId, TipoHistorico.Adiantamento, faturas);

    return liquidacao;
  }

  async fatura(caixaId: number, faturaDto: ReceberFaturaDto): Promise<FaturaEntity> {
    return;
  }

  async romaneio(caixaId: number, romaneioDto: ReceberRomaneioDto): Promise<RomaneioView> {
    const empresa = this.contextService.currentBranch();
    const romaneio = await this.romaneioService.findById(empresa.id, romaneioDto.romaneioId, ['itens']);
    if (!romaneio) {
      throw new BadRequestException('Romaneio não encontrado');
    } else if (romaneio.itens.length == 0) {
      throw new BadRequestException('Romaneio não possui itens');
    } else if (romaneio.modalidade == ModalidadeRomaneio.Saida) {
      const produtos = romaneio.itens
        .groupBy((x) => x.produtoId)
        .map((x) => ({ produtoId: x.key, quantidade: x.values.sum((y) => y.quantidade) }));

      const produtoIds = produtos.map((x) => x.produtoId);
      const estoque = await this.estoqueService.findByProdutoIds(empresa.id, produtoIds);

      const estInsuficiente = estoque.filter((x) => x.saldo < produtos.find((y) => y.produtoId == x.produtoId).quantidade);
      if (estInsuficiente.length > 0) {
        throw new BadRequestException(`Estoque insuficiente para os produtos: ${estInsuficiente.map((x) => x.produtoId).join(', ')}`);
      }
    }

    switch (romaneio.operacao) {
      case OperacaoRomaneio.Outros:
        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId);
      case OperacaoRomaneio.Venda:
        const valorRomaneio = romaneio.valorLiquido + (romaneio.tipoFrete == TipoFrete.FOB ? romaneio.valorFrete : 0);

        if (!romaneioDto.formasDePagamento) {
          throw new BadRequestException('Nenhuma forma de pagamento informada');
        } else if (romaneio.situacao != SituacaoRomaneio.EmAndamento) {
          throw new BadRequestException('Romaneio não está em andamento');
        } else if (valorRomaneio > romaneioDto.formasDePagamento.sum((x) => x.valor)) {
          throw new BadRequestException('O valor pago é insuficiente para encerrar o romaneio');
        }
        const recebimento: RecebimentoDto = { pessoaId: romaneio.pessoaId, valor: romaneio.valorLiquido, romaneioId: romaneio.romaneioId };
        const faturas = await this.lancarFaturas(empresa.id, recebimento, romaneioDto.formasDePagamento);
        const liquidacao = await this.lancarLiquidacao(caixaId, TipoHistorico.Venda, faturas);
        const liquidacaoId = liquidacao.first().liquidacao;

        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId, liquidacaoId);
    }

    return romaneio;
  }

  async lancarLiquidacao(caixaId: number, tipoHistorico: TipoHistorico, faturas: FaturaEntity[]): Promise<CaixaExtratoEntity[]> {
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

    return this.caixaExtratoService.lancarLiquidacao(caixaId, liquidacaoId, liquidacaoFatura);
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

    const creditoDeDevolucao = tipoDocumentos.first((x) => x.tipoDocumento == TipoDocumento.Credito_de_devolucao);
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
