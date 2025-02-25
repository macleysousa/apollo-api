import { BadRequestException, Injectable } from '@nestjs/common';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';
import { PessoaExtratoService } from 'src/modules/pessoa/extrato/pessoa-extrato.service';
import { ModalidadeRomaneio } from 'src/modules/romaneio/enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from 'src/modules/romaneio/enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from 'src/modules/romaneio/enum/situacao-romaneio.enum';
import { RomaneioService } from 'src/modules/romaneio/romaneio.service';
import { RomaneioItemService } from 'src/modules/romaneio/romaneio-item/romaneio-item.service';

import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';
import { CaixaExtratoService } from '../extrato/extrato.service';

import { CancelarAdiantamentoDto } from './dto/cancelar-adianteamento.dto';
import { CancelarRomaneioDto } from './dto/cancelar-romaneio.dto';

@Injectable()
export class CancelarService {
  constructor(
    private readonly contextService: ContextService,
    private readonly caixaExtratoService: CaixaExtratoService,
    private readonly pessoaExtratoService: PessoaExtratoService,
    private readonly romaneioService: RomaneioService,
    private readonly romaneioItemService: RomaneioItemService,
    private readonly estoqueService: EstoqueService,
  ) {}

  async adiantamento(caixaId: number, dto: CancelarAdiantamentoDto): Promise<void> {
    const empresaId = this.contextService.empresaId();

    const liquidacao = await this.caixaExtratoService.findByLiquidacao(empresaId, caixaId, dto.liquidacao);
    if (!liquidacao) {
      throw new BadRequestException(`A liquidação ${dto.liquidacao} não foi encontrada`);
    } else if (liquidacao.first().tipoHistorico != TipoHistorico.Adiantamento) {
      throw new BadRequestException(`A liquidação ${dto.liquidacao} não é um adiantamento`);
    } else if (liquidacao.first().cancelado) {
      throw new BadRequestException(`A liquidação ${dto.liquidacao} já foi cancelada`);
    }

    const saldoAdiantamento = await this.pessoaExtratoService.findSaldoAdiantamento(caixaId, dto.pessoaId);
    if (saldoAdiantamento < liquidacao.sum((x) => x.valor)) {
      throw new BadRequestException(`Saldo em adiantamento insuficiente para realizar o cancelamentoo`);
    }

    await this.caixaExtratoService.cancelar(empresaId, caixaId, dto.liquidacao, dto.motivo);
  }

  async romaneio(caixaId: number, dto: CancelarRomaneioDto): Promise<void> {
    const empresaId = this.contextService.empresaId();

    const romaneio = await this.romaneioService.findById(empresaId, dto.romaneioId);
    if (!romaneio) {
      throw new BadRequestException(`O romaneio "${dto.romaneioId}" não foi encontrado`);
    } else if (romaneio.situacao == SituacaoRomaneio.cancelado) {
      throw new BadRequestException(`O romaneio "${dto.romaneioId}" já foi cancelado`);
    } else if (romaneio.situacao == SituacaoRomaneio.encerrado && romaneio.caixaId != caixaId) {
      throw new BadRequestException(`O romaneio "${dto.romaneioId}" não pertence ao caixa "${caixaId}"`);
    }

    if (romaneio.situacao == SituacaoRomaneio.encerrado && romaneio.modalidade == ModalidadeRomaneio.entrada) {
      const romaneioItens = await this.romaneioItemService.findByRomaneioId(dto.romaneioId);
      const produtoIds = romaneioItens.map((x) => x.produtoId);

      const estoque = await this.estoqueService.findByProdutoIds(empresaId, produtoIds);
      estoque.forEach((x) => {
        const quantidade = romaneioItens.filter((y) => y.produtoId == x.produtoId).sum((y) => y.quantidade);
        if (quantidade > x.saldo) {
          throw new BadRequestException(`O produto "${x.produtoId}" não possui estoque suficiente para realizar o cancelamento`);
        }
      });
    }

    if (romaneio.situacao == SituacaoRomaneio.encerrado && romaneio.operacao == OperacaoRomaneio.venda_devolucao) {
      const saldoCredev = await this.pessoaExtratoService.findSaldoCreditoDeDevolucao(empresaId, romaneio.pessoaId);
      if (saldoCredev < romaneio.valorLiquido) {
        throw new BadRequestException(`Saldo de crédito de devolução insuficiente para realizar o cancelamento`);
      }
    } else if (romaneio.situacao == SituacaoRomaneio.encerrado && romaneio.operacao == OperacaoRomaneio.venda) {
      const romaneioItens = await this.romaneioItemService.findByRomaneioId(dto.romaneioId);
      const produtoDevolucaoIds = romaneioItens.filter((x) => x.devolvido > 0).map((x) => x.produtoId);
      if (produtoDevolucaoIds.length > 0) {
        throw new BadRequestException(`O romaneio "${dto.romaneioId}" já possui produtos devolvidos, não é possível cancelar`);
      }
    }

    await this.romaneioService.cancelar(empresaId, dto.romaneioId, dto.motivo);
  }
}
