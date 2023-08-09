import { BadRequestException, Injectable } from '@nestjs/common';

import { ContextService } from 'src/context/context.service';
import { FaturaService } from 'src/modules/fatura/fatura.service';
import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';
import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { FaturaEntity } from 'src/modules/fatura/entities/fatura.entity';
import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';

import { CaixaExtratoService } from '../extrato/extrato.service';
import { PagamentoDto } from './dto/pagamento.dto';
import { ReceberAdiantamentoDto } from './dto/receber-adiantamento.dto';
import { ReceberFaturaDto } from './dto/receber-fatura.dto';
import { ReceberRomaneioDto } from './dto/receber-romaneio.dto';
import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { RecebimentoDto } from './dto/recebimento.dto';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';
import { OperacaoRomaneio } from 'src/modules/romaneio/enum/operacao-romaneio.enum';
import { validateSync } from 'class-validator';

@Injectable()
export class ReceberService {
  constructor(
    private readonly contextService: ContextService,
    private readonly formaDePagamentoService: FormaDePagamentoService,
    private readonly pessoaExtratoService: PessoaExtratoService,
    private readonly faturaService: FaturaService,
    private readonly caixaExtratoService: CaixaExtratoService,
    private readonly romaneioService: RomaneioService
  ) {}

  async adiantamento(caixaId: number, dto: ReceberAdiantamentoDto): Promise<unknown> {
    const empresa = this.contextService.currentBranch();

    const faturas = await this.lancarFaturas(empresa.id, { ...dto }, dto.formasDePagamento);
    const liquidacao = await this.lancarLiquidacao(caixaId, TipoHistorico.Adiantamento, faturas);

    return liquidacao;
  }

  async fatura(caixaId: number, faturaDto: ReceberFaturaDto) {}

  async romaneio(caixaId: number, romaneioDto: ReceberRomaneioDto) {
    const empresa = this.contextService.currentBranch();
    const romaneio = await this.romaneioService.findById(empresa.id, romaneioDto.romaneioId);

    switch (romaneio.operacao) {
      case OperacaoRomaneio.Outros:
        return this.romaneioService.encerrar(empresa.id, caixaId, romaneioDto.romaneioId);
    }

    return romaneio;
  }

  async lancarLiquidacao(caixaId: number, tipoHistorico: TipoHistorico, faturas: FaturaEntity[]): Promise<unknown> {
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
        observacao: recebimento?.observacao,
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
        tipoDocumento: formasDePagamentos.first((b) => b.id === x.key).tipo,
        valor: x.values.sum((y) => y.valor),
      }));

    let faturaTroco: any = null;
    if (pagamentos.sum((x) => x.valor) < recebimento.valor) {
      throw new BadRequestException('Valor insuficiente para realizar o a operação.');
    } else if (pagamentos.sum((x) => x.valor) > recebimento.valor) {
      const valorTroco = pagamentos.sum((x) => x.valor) - recebimento.valor;
      const valorDinherio = tipoDocumentos.filter((x) => x.tipoDocumento === TipoDocumento.Dinheiro).sum((x) => x.valor);
      if (valorDinherio < valorTroco) {
        throw new BadRequestException('Valor em dinheiro insuficiente para realizar o a operação com troco.');
      } else {
        faturaTroco = {
          ...recebimento,
          valor: valorTroco,
          tipoMovimento: TipoMovimento.Debito,
          tipoDocumento: TipoDocumento.Troco,
          itens: [{ parcela: 1, valor: valorTroco }],
        };
      }
    }

    const adiantamento = tipoDocumentos.first((x) => x.tipoDocumento === TipoDocumento.Adiantamento);
    const saldoAdiantamento = await this.pessoaExtratoService.findSaldoAdiantamento(empresaId, recebimento.pessoaId);
    if (adiantamento && saldoAdiantamento < adiantamento.valor) {
      throw new BadRequestException('Saldo de adiantamento insuficiente para realizar o a operação.');
    }

    const creditoDeDevolucao = tipoDocumentos.first((x) => x.tipoDocumento === TipoDocumento.Credito_de_devolucao);
    const saldoCreditoDeDevolucao = await this.pessoaExtratoService.findSaldoCreditoDeDevolucao(empresaId, recebimento.pessoaId);
    if (creditoDeDevolucao && saldoCreditoDeDevolucao < creditoDeDevolucao.valor) {
      throw new BadRequestException('Creditos de devolução insuficiente para realizar o a operação.');
    }

    const faturas: FaturaEntity[] = [];
    for await (const pagamento of pagamentos) {
      const formaDePagamento = await this.formaDePagamentoService.findById(pagamento.formaDePagamentoId);
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
