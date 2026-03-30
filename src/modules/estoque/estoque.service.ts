import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';

import { EstoqueEntity } from './entities/estoque.entity';
import { EstoqueFilter } from './filters/estoque.filters';
import { EstoqueView } from './views/estoque.view';

interface filter {
  empresaIds: number[];
  referenciaIds: number[];
  referenciaIdExternos: string[];
  produtoIds: number[];
  produtoIdExternos: string[];
  corIds: number[];
  tamanhoIds: number[];
}
@Injectable()
export class EstoqueService {
  constructor(
    @InjectRepository(EstoqueEntity)
    private repository: Repository<EstoqueEntity>,
    @InjectRepository(EstoqueView)
    private view: Repository<EstoqueView>,
  ) {}

  async find(filter: EstoqueFilter): Promise<Pagination<EstoqueView>> {
    const queryBuilder = this.view.createQueryBuilder('e');
    queryBuilder.where({ empresaId: Not(IsNull()) });

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere({ empresaId: In(filter.empresaIds) });
    }

    if (filter?.referenciaIds && filter.referenciaIds.length > 0) {
      queryBuilder.andWhere({ referenciaId: In(filter.referenciaIds) });
    }

    if (filter?.referenciaIdExternos && filter.referenciaIdExternos.length > 0) {
      queryBuilder.andWhere({ referenciaIdExterno: In(filter.referenciaIdExternos) });
    }

    if (filter?.produtoIds && filter.produtoIds.length > 0) {
      queryBuilder.andWhere({ produtoId: In(filter.produtoIds) });
    }

    if (filter?.produtoIdExternos && filter.produtoIdExternos.length > 0) {
      queryBuilder.andWhere({ produtoIdExterno: In(filter.produtoIdExternos) });
    }

    if (filter?.corIds && filter.corIds.length > 0) {
      queryBuilder.andWhere({ corId: In(filter.corIds) });
    }

    if (filter?.tamanhoIds && filter.tamanhoIds.length > 0) {
      queryBuilder.andWhere({ tamanhoId: In(filter.tamanhoIds) });
    }

    if (filter?.ultimaAtualizacaoInicio) {
      queryBuilder.andWhere('e.atualizadoEm >= :ultimaAtualizacaoInicio', {
        ultimaAtualizacaoInicio: filter.ultimaAtualizacaoInicio,
      });
    }

    if (filter?.ultimaAtualizacaoFim) {
      queryBuilder.andWhere('e.atualizadoEm <= :ultimaAtualizacaoFim', {
        ultimaAtualizacaoFim: filter.ultimaAtualizacaoFim,
      });
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 100;

    return paginate<EstoqueView>(queryBuilder, { page, limit });
  }

  async findByProdutoId(empresaId: number, produtoId: number): Promise<EstoqueView> {
    return this.view.findOne({ where: { empresaId, produtoId } });
  }

  async findByProdutoIds(empresaId: number, produtoIds: number[]): Promise<EstoqueView[]> {
    return this.view.find({ where: { empresaId, produtoId: In(produtoIds) } });
  }
}
