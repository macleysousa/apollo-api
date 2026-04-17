import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';
import { ContextService } from 'src/context/context.service';
import { CaixaService } from 'src/modules/caixa/caixa.service';
import { CaixaExtratoService } from 'src/modules/caixa/extrato/extrato.service';

import { LancarMovimento } from '../extrato/dto/lancar-movimento.dto';
import { TipoHistorico } from '../extrato/enum/tipo-historico.enum';

import { CreateSuprimentoDto } from './dto/create-suprimento.dto';
import { CaixaSuprimentoEntity } from './entities/suprimento.entity';

@Injectable()
export class CaixaSuprimentoService {
  constructor(
    @InjectRepository(CaixaSuprimentoEntity)
    private readonly repository: Repository<CaixaSuprimentoEntity>,
    private readonly contextService: ContextService,
    private readonly caixaService: CaixaService,
    private readonly caixaExtratoService: CaixaExtratoService,
  ) {}

  async create(caixaId: number, dto: CreateSuprimentoDto): Promise<CaixaSuprimentoEntity> {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const caixa = await this.caixaService.findById(empresa.id, caixaId);
    if (!caixa) {
      throw new NotFoundException('Caixa não encontrado');
    }
    const liquidacao = await this.caixaExtratoService.newLiquidacaoId();

    const suprimento = await this.repository.save({
      empresaId: empresa.id,
      data: empresa.data,
      caixaId,
      valor: dto.valor,
      origem: dto.origem ?? 'externa',
      descricao: dto.descricao,
      operadorId,
      liquidacao,
    });

    const lancamento: LancarMovimento[] = [
      {
        tipoDocumento: TipoDocumento.Dinheiro,
        tipoHistorico: TipoHistorico.Suprimento,
        tipoMovimento: TipoMovimento.Credito,
        valor: suprimento.valor,
        observacao: suprimento.descricao,
        suprimentoId: suprimento.id,
      } as LancarMovimento,
    ];

    await this.caixaExtratoService.lancar(caixaId, liquidacao, lancamento);

    return suprimento;
  }

  async find(caixaId: number): Promise<CaixaSuprimentoEntity[]> {
    const empresaId = this.contextService.empresaId();
    return this.repository.find({ where: { empresaId, caixaId } });
  }

  async findById(caixaId: number, id: number): Promise<CaixaSuprimentoEntity> {
    const empresaId = this.contextService.empresaId();
    return this.repository.findOne({ where: { empresaId, caixaId, id } });
  }

  async cancel(caixaId: number, id: number, motivo: string): Promise<void> {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const suprimento = await this.repository.findOne({ where: { empresaId: empresa.id, caixaId, id } });
    if (!suprimento) throw new NotFoundException('Suprimento não encontrado');
    if (suprimento.cancelado) throw new BadRequestException('Suprimento já cancelado');

    let liquidacao = suprimento.liquidacao;
    if (!liquidacao) {
      const extrato = await this.caixaExtratoService.find(empresa.id, caixaId);
      const found = extrato.find((e) => (e as any).suprimentoId === suprimento.id);
      liquidacao = found?.liquidacao;
      if (!liquidacao) throw new BadRequestException('Movimento de extrato não encontrado para este suprimento');
    }

    await this.caixaExtratoService.cancelar(empresa.id, caixaId, liquidacao, motivo);

    await this.repository.update(
      { empresaId: empresa.id, caixaId, id },
      {
        cancelado: true,
        motivoCancelamento: motivo,
        operadorCancelamentoId: operadorId,
        canceladoEm: () => 'CURRENT_TIMESTAMP',
      },
    );
  }
}
