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

@Injectable()
export class ReceberService {
  constructor(
    private readonly contextService: ContextService,
    private readonly formaDePagamentoService: FormaDePagamentoService,
    private readonly pessoaExtratoService: PessoaExtratoService,
    private readonly faturaService: FaturaService,
    private readonly caixaExtratoService: CaixaExtratoService
  ) {}

  async adiantamento(caixaId: number, dto: ReceberAdiantamentoDto): Promise<void> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    if (dto.formasDePagamento.sum((x) => x.valor) < dto.valor) {
      throw new BadRequestException('O valor recebido não pode ser menor que o valor total.');
    }

    const faturas = await this.lancarFaturas(empresa.id, dto.pessoaId, dto.observacao, dto.formasDePagamento);
    faturas.map(({ tipoDocumento, itens }) => {
      return itens.map(({ faturaId, parcela, valor, observacao }) => {
        return this.caixaExtratoService.lancarMovimento(caixaId, {
          faturaId,
          faturaParcela: parcela,
          tipoDocumento,
          tipoHistorico: TipoHistorico.Adiantamento,
          tipoMovimento: TipoMovimento.Credito,
          valor: valor,
          observacao,
        });
      });
    });
  }

  async fatura(caixaId: number, faturaDto: ReceberFaturaDto) {}

  async romaneio(caixaId: number, romaneioDto: ReceberRomaneioDto) {}

  async lancarFaturas(empresaId: number, pessoaId: number, observacao: string, formasDePagamento: PagamentoDto[]): Promise<FaturaEntity[]> {
    const pagamentos = formasDePagamento
      .groupBy(({ controle, formaDePagamentoId }) => ({ controle, formaDePagamentoId }))
      .select((x) => ({
        pessoaId,
        formaDePagamentoId: x.key.formaDePagamentoId,
        valor: x.values.sum((y) => y.valor),
        parcelas: x.values.length,
        itens: x.values
          .groupBy((item) => item.parcela)
          .select((y) => ({
            ...y.values.firstOrDefault(),
            parcela: y.key,
            valor: y.values.sum((z) => z.valor),
          })) as any,
        observacao,
      }));

    const formasDePagamentos = await this.formaDePagamentoService.find();
    const tipoDocumentos = formasDePagamento
      .groupBy((x) => x.formaDePagamentoId)
      .select((x) => ({
        id: x.key,
        tipoDocumento: formasDePagamentos.firstOrDefault((b) => b.id === x.key).tipo,
        valor: x.values.sum((y) => y.valor),
      }));

    const adiantamento = tipoDocumentos.firstOrDefault((x) => x.tipoDocumento === TipoDocumento.Adiantamento);
    const saldoAdiantamento = await this.pessoaExtratoService.findSaldoAdiantamento(empresaId, pessoaId);
    if (adiantamento && saldoAdiantamento < adiantamento.valor) {
      throw new BadRequestException('Saldo de adiantamento insuficiente para realizar o a operação.');
    }

    const creditoDeDevolucao = tipoDocumentos.firstOrDefault((x) => x.tipoDocumento === TipoDocumento.Credito_de_devolucao);
    const saldoCreditoDeDevolucao = await this.pessoaExtratoService.findSaldoCreditoDeDevolucao(empresaId, pessoaId);
    if (creditoDeDevolucao && saldoCreditoDeDevolucao < creditoDeDevolucao.valor) {
      throw new BadRequestException('Creditos de devolução insuficiente para realizar o a operação.');
    }

    return Promise.all(
      pagamentos.map(async (pagamento) => {
        const formaDePagamento = await this.formaDePagamentoService.findById(pagamento.formaDePagamentoId);
        return this.faturaService.createAutomatica({ ...pagamento, tipoDocumento: formaDePagamento.tipo });
      })
    );
  }
}
