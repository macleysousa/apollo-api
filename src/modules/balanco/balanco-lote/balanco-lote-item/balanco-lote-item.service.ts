import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { BalancoService } from '../../balanco.service';
import { BalancoItemEntity } from '../../balanco-item/entities/balanco-item.entity';
import { SituacaoBalanco } from '../../enum/situacao-balanco.enum';
import { BalancoLoteEntity } from '../entities/balanco-lote.entity';
import { SituacaoBalancoLote } from '../enum/situacao-balanco-lote.enum';

import { AddRemoveBalancoLoteItemDto } from './dto/add-remove-balanco-lote-item.dto';
import { BalancoLoteItemEntity } from './entities/balanco-lote-item.entity';

@Injectable()
export class BalancoLoteItemService {
  constructor(
    @InjectRepository(BalancoLoteItemEntity)
    private readonly repository: Repository<BalancoLoteItemEntity>,
    @InjectRepository(BalancoLoteEntity)
    private readonly loteRepository: Repository<BalancoLoteEntity>,
    @InjectRepository(BalancoItemEntity)
    private readonly balancoItemRepository: Repository<BalancoItemEntity>,
    @Inject(forwardRef(() => BalancoService))
    private readonly balancoService: BalancoService,
    private readonly contextService: ContextService,
  ) {}

  async add(balancoId: number, loteId: number, dto: AddRemoveBalancoLoteItemDto): Promise<void> {
    const empresa = this.contextService.empresa();
    const operadorId = this.contextService.operadorId();

    const balanco = await this.balancoService.findById(empresa.id, balancoId);
    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado', {
        description: 'Balanço não encontrado para a empresa informada',
      });
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento', {
        description: 'Não é permitido adicionar itens em um balanço que não está em andamento',
      });
    }

    const lote = await this.loteRepository.findOne({ where: { empresaId: empresa.id, balancoId, id: loteId } });
    if (!lote) {
      throw new BadRequestException('Lote não encontrado', {
        description: 'Lote não encontrado para o balanço informado',
      });
    }

    if (lote.situacao === SituacaoBalancoLote.cancelado) {
      throw new BadRequestException('Lote está cancelado', {
        description: 'Não é permitido adicionar itens em um lote cancelado',
      });
    }

    const balancoItem = await this.balancoItemRepository.findOne({
      where: { empresaId: empresa.id, balancoId, produtoId: dto.produtoId },
    });

    if (!balancoItem) {
      throw new BadRequestException('Produto não encontrado no balanço', {
        description: 'O produto deve ser adicionado ao balanço antes de ser incluído em um lote',
      });
    }

    const item = await this.repository.findOne({
      where: { empresaId: empresa.id, balancoId, loteId, produtoId: dto.produtoId },
    });

    if (item) {
      await this.repository.update(
        { empresaId: empresa.id, balancoId, loteId, produtoId: dto.produtoId },
        { quantidadeContada: item.quantidadeContada + dto.quantidadeContada, operadorId },
      );
      return;
    }

    const sequencia = await this.repository
      .createQueryBuilder('i')
      .select('coalesce(max(i.sequencia), 0) + 1', 'sequencia')
      .where('i.empresaId = :empresaId', { empresaId: empresa.id })
      .andWhere('i.balancoId = :balancoId', { balancoId })
      .andWhere('i.loteId = :loteId', { loteId })
      .getRawOne()
      .then((r) => Number(r.sequencia));

    await this.repository.insert({
      empresaId: empresa.id,
      balancoId,
      loteId,
      sequencia,
      produtoId: dto.produtoId,
      quantidadeContada: dto.quantidadeContada,
      operadorId,
    });
  }

  async findByLoteId(balancoId: number, loteId: number): Promise<BalancoLoteItemEntity[]> {
    const empresaId = this.contextService.empresaId();

    return this.repository.find({
      where: { empresaId, balancoId, loteId },
      order: { sequencia: 'ASC' },
    });
  }

  async remove(balancoId: number, loteId: number, produtoId: number): Promise<void> {
    const empresa = this.contextService.empresa();

    const balanco = await this.balancoService.findById(empresa.id, balancoId);
    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    const item = await this.repository.findOne({ where: { empresaId: empresa.id, balancoId, loteId, produtoId } });
    if (!item) {
      throw new BadRequestException('Item do lote não encontrado');
    }

    await this.repository.delete({ empresaId: empresa.id, balancoId, loteId, produtoId });
  }
}
