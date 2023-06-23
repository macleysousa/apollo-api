import { BadRequestException, Injectable } from '@nestjs/common';

import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';
import { ContextService } from 'src/context/context.service';

import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { CaixaExtratoService } from '../extrato/extrato.service';
import { CancelarAdiantamentoDto } from './dto/cancelar-adianteamento.dto';

@Injectable()
export class CancelarService {
  constructor(
    private readonly caixaExtratoService: CaixaExtratoService,
    private readonly pessoaExtratoService: PessoaExtratoService,
    private readonly contextService: ContextService
  ) {}

  async adiantamento(caixaId: number, dto: CancelarAdiantamentoDto) {
    const empresaId = this.contextService.empresaId();

    const liquidacao = await this.caixaExtratoService.findByLiquidacao(empresaId, caixaId, dto.liquidacao);
    if (!liquidacao) {
      throw new BadRequestException(`A liquidação ${dto.liquidacao} não foi encontrada`);
    } else if (liquidacao.firstOrDefault().tipoHistorico != TipoHistorico.Adiantamento) {
      throw new BadRequestException(`A liquidação ${dto.liquidacao} não é um adiantamento`);
    } else if (liquidacao.firstOrDefault().cancelado) {
      throw new BadRequestException(`A liquidação ${dto.liquidacao} já foi cancelada`);
    }

    const saldoAdiantamento = await this.pessoaExtratoService.findSaldoAdiantamento(caixaId, dto.pessoaId);
    if (saldoAdiantamento < liquidacao.sum((x) => x.valor)) {
      throw new BadRequestException(`Saldo em adiantamento insuficiente para realizar o cancelamentoo`);
    }

    await this.caixaExtratoService.cancelarLiquidacao(empresaId, caixaId, dto.liquidacao, dto.motivo);
  }
}
