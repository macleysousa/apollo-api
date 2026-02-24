import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { BalancoItemEntity } from './balanco-item/entities/balanco-item.entity';
import { BalancoLoteItemEntity } from './balanco-lote/balanco-lote-item/entities/balanco-lote-item.entity';
import { CreateBalancoDto } from './dto/create-balanco.dto';
import { UpdateBalancoDto } from './dto/update-balanco.dto';
import { BalancoEntity } from './entities/balanco.entity';
import { SituacaoBalanco } from './enum/situacao-balanco.enum';

interface BalancoResumoItem {
  produtoId: number;
  quantidadeContada: number;
  quantidadeOriginal: number;
  diferenca: number;
}

interface BalancoResumo {
  balanco: BalancoEntity;
  itens: BalancoResumoItem[];
  totalItens: number;
  totalDiferenca: number;
}

@Injectable()
export class BalancoService {
  constructor(
    @InjectRepository(BalancoEntity)
    private readonly repository: Repository<BalancoEntity>,
    @InjectRepository(BalancoItemEntity)
    private readonly itemRepository: Repository<BalancoItemEntity>,
    @InjectRepository(BalancoLoteItemEntity)
    private readonly loteItemRepository: Repository<BalancoLoteItemEntity>,
    private readonly contextService: ContextService,
  ) {}

  async create(dto: CreateBalancoDto): Promise<BalancoEntity> {
    const usuario = this.contextService.usuario();
    const empresa = this.contextService.empresa();

    const balanco = await this.repository.save({
      empresaId: empresa.id,
      data: empresa.data,
      observacao: dto.observacao,
      situacao: SituacaoBalanco.em_andamento,
      operadorId: usuario.id,
    });

    return this.findById(empresa.id, balanco.id);
  }

  async find(situacao?: SituacaoBalanco, page = 1, limit = 100): Promise<Pagination<BalancoEntity>> {
    const empresaId = this.contextService.empresaId();

    const queryBuilder = this.repository.createQueryBuilder('b');
    queryBuilder.where('b.empresaId = :empresaId', { empresaId });

    if (situacao) {
      queryBuilder.andWhere('b.situacao = :situacao', { situacao });
    }

    queryBuilder.orderBy('b.id', 'DESC');

    return paginate<BalancoEntity>(queryBuilder, { page, limit });
  }

  async findById(empresaId: number, id: number): Promise<BalancoEntity> {
    return this.repository.findOne({ where: { empresaId, id } });
  }

  async update(empresaId: number, id: number, dto: UpdateBalancoDto): Promise<BalancoEntity> {
    const operadorId = this.contextService.operadorId();
    const balanco = await this.findById(empresaId, id);

    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    await this.repository.update({ empresaId, id }, { ...dto, operadorId }).catch(() => {
      throw new BadRequestException('Não foi possível atualizar o balanço');
    });

    return this.findById(empresaId, id);
  }

  async encerrar(empresaId: number, id: number, observacao?: string): Promise<BalancoEntity> {
    const operadorId = this.contextService.operadorId();
    const balanco = await this.findById(empresaId, id);

    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao !== SituacaoBalanco.em_andamento) {
      throw new BadRequestException('Balanço não está em andamento');
    }

    const itens = await this.itemRepository.find({ where: { empresaId, balancoId: id } });
    if (!itens || itens.length === 0) {
      throw new BadRequestException('Balanço não possui produtos para encerrar');
    }

    // Calcular quantidadeContada para cada item somando os itens dos lotes
    for (const item of itens) {
      const loteItens = await this.loteItemRepository.find({
        where: { empresaId, balancoId: id, produtoId: item.produtoId },
      });

      const quantidadeContada = loteItens.reduce((sum, loteItem) => sum + Number(loteItem.quantidadeContada), 0);

      await this.itemRepository.update(
        { empresaId, balancoId: id, produtoId: item.produtoId },
        { quantidadeContada, operadorId },
      );
    }

    await this.repository
      .update(
        { empresaId, id },
        { situacao: SituacaoBalanco.encerrado, observacao: observacao ?? balanco.observacao, operadorId },
      )
      .catch(() => {
        throw new BadRequestException('Não foi possível encerrar o balanço');
      });

    return this.findById(empresaId, id);
  }

  async cancelar(empresaId: number, id: number, motivo: string): Promise<BalancoEntity> {
    const operadorId = this.contextService.operadorId();
    const balanco = await this.findById(empresaId, id);

    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    if (balanco.situacao === SituacaoBalanco.cancelado) {
      throw new BadRequestException('Balanço já está cancelado');
    }

    await this.repository
      .update({ empresaId, id }, { situacao: SituacaoBalanco.cancelado, motivoCancelamento: motivo, operadorId })
      .catch(() => {
        throw new BadRequestException('Não foi possível cancelar o balanço');
      });

    return this.findById(empresaId, id);
  }

  async resumo(empresaId: number, id: number): Promise<BalancoResumo> {
    const balanco = await this.findById(empresaId, id);

    if (!balanco) {
      throw new BadRequestException('Balanço não encontrado');
    }

    const itens = await this.itemRepository.find({ where: { empresaId, balancoId: id } });

    const itensResumo = itens.map((item) => {
      const original = Number(item.quantidadeOriginal ?? 0);
      const contada = Number(item.quantidadeContada);

      return {
        produtoId: item.produtoId,
        quantidadeContada: contada,
        quantidadeOriginal: original,
        diferenca: contada - original,
      };
    });

    return {
      balanco,
      itens: itensResumo,
      totalItens: itensResumo.length,
      totalDiferenca: itensResumo.reduce((acc, current) => acc + current.diferenca, 0),
    };
  }
}
