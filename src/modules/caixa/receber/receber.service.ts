import { BadRequestException, Injectable } from '@nestjs/common';

import { ContextService } from 'src/context/context.service';
import { FaturaService } from 'src/modules/fatura/fatura.service';
import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';

import { PagamentoDto } from './dto/pagamento.dto';
import { ReceberAdiantamentoDto } from './dto/receber-adiantamento.dto';
import { ReceberFaturaDto } from './dto/receber-fatura.dto';
import { ReceberRomaneioDto } from './dto/receber-romaneio.dto';
import { FaturaEntity } from 'src/modules/fatura/entities/fatura.entity';

@Injectable()
export class ReceberService {
  constructor(
    private readonly contextService: ContextService,
    private readonly formaDePagamentoService: FormaDePagamentoService,
    private readonly faturaService: FaturaService
  ) {}

  async adiantamento(caixaId: number, dto: ReceberAdiantamentoDto): Promise<void> {
    const usuario = this.contextService.currentUser();
    const empresa = this.contextService.currentBranch();

    if (dto.formasDePagamento.sum((x) => x.valor) < dto.valor) {
      throw new BadRequestException('O valor recebido não pode ser menor que o valor total.');
    }

    const faturas = await this.lancarFaturas(caixaId, dto.pessoaId, dto.observacao, dto.formasDePagamento);
  }

  async fatura(caixaId: number, faturaDto: ReceberFaturaDto) {}

  async romaneio(caixaId: number, romaneioDto: ReceberRomaneioDto) {}

  async lancarFaturas(caixaId: number, pessoaId: number, observacao: string, formasDePagamento: PagamentoDto[]): Promise<FaturaEntity[]> {
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

    return Promise.all(
      pagamentos.map(async (pagamento) => {
        const formaDePagamento = await this.formaDePagamentoService.findById(pagamento.formaDePagamentoId);
        return this.faturaService.createAutomatica({
          ...pagamento,
          tipoDocumento: formaDePagamento.tipo,
        });
      })
    );
  }
}
