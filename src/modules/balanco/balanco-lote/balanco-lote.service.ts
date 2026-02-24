import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { BalancoService } from '../balanco.service';
import { SituacaoBalanco } from '../enum/situacao-balanco.enum';

import { CancelarBalancoLoteDto } from './dto/cancelar-balanco-lote.dto';
import { CreateBalancoLoteDto } from './dto/create-balanco-lote.dto';
import { UpdateBalancoLoteDto } from './dto/update-balanco-lote.dto';
import { BalancoLoteEntity } from './entities/balanco-lote.entity';
import { SituacaoBalancoLote } from './enum/situacao-balanco-lote.enum';

@Injectable()
export class BalancoLoteService {
  constructor(
    @InjectRepository(BalancoLoteEntity)
    private readonly repository: Repository<BalancoLoteEntity>,
    @Inject(forwardRef(() => BalancoService))
    private readonly balancoService: BalancoService,
    private readonly contextService: ContextService,
  ) {}

  async create(balancoId: number, dto: CreateBalancoLoteDto): Promise<BalancoLoteEntity> {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const balanco = await this.balancoService.findById(empresa.id, balancoId);
    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    const lote = await this.repository.save({
      ...dto,
      empresaId: empresa.id,
      balancoId,
      situacao: SituacaoBalancoLote.ativo,
      operadorId,
    });

    return this.findById(empresa.id, balancoId, lote.id);
  }

  async findByBalancoId(balancoId: number): Promise<BalancoLoteEntity[]> {
    const empresaId = this.contextService.empresaId();
    return this.repository.find({ where: { empresaId, balancoId }, order: { id: 'ASC' } });
  }

  async findById(empresaId: number, balancoId: number, id: number): Promise<BalancoLoteEntity> {
    return this.repository.findOne({ where: { empresaId, balancoId, id } });
  }

  async update(balancoId: number, loteId: number, dto: UpdateBalancoLoteDto): Promise<BalancoLoteEntity> {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const balanco = await this.balancoService.findById(empresa.id, balancoId);
    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    const lote = await this.findById(empresa.id, balancoId, loteId);
    if (!lote) {
      throw new BadRequestException('Lote não encontrado');
    }

    if (lote.situacao === SituacaoBalancoLote.cancelado) {
      throw new BadRequestException('Lote já está cancelado');
    }

    await this.repository.update({ empresaId: empresa.id, balancoId, id: loteId }, { ...dto, operadorId }).catch(() => {
      throw new BadRequestException('Não foi possível atualizar o lote');
    });

    return this.findById(empresa.id, balancoId, loteId);
  }

  async cancelar(balancoId: number, loteId: number, dto: CancelarBalancoLoteDto): Promise<BalancoLoteEntity> {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const balanco = await this.balancoService.findById(empresa.id, balancoId);
    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    const lote = await this.findById(empresa.id, balancoId, loteId);
    if (!lote) {
      throw new BadRequestException('Lote não encontrado');
    }

    if (lote.situacao === SituacaoBalancoLote.cancelado) {
      throw new BadRequestException('Lote já está cancelado');
    }

    await this.repository
      .update(
        { empresaId: empresa.id, balancoId, id: loteId },
        { situacao: SituacaoBalancoLote.cancelado, motivoCancelamento: dto.motivo, operadorId },
      )
      .catch(() => {
        throw new BadRequestException('Não foi possível cancelar o lote');
      });

    return this.findById(empresa.id, balancoId, loteId);
  }
}
