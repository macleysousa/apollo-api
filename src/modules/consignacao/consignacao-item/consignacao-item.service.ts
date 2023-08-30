import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemFilter } from './filters/consignacao-item.filter';

@Injectable()
export class ConsignacaoItemService {
  constructor(
    @InjectRepository(ConsignacaoItemEntity)
    private readonly repository: Repository<ConsignacaoItemEntity>
  ) {}

  async find(filter: ConsignacaoItemFilter): Promise<ConsignacaoItemEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('i');
    queryBuilder.where('i.empresaId IS NOT NULL');

    if (filter?.empresaIds && filter.empresaIds.length > 0) {
      queryBuilder.andWhere('i.empresaId IN (:...empresaIds)', { empresaIds: filter.empresaIds });
    }

    if (filter?.consignacaoIds && filter.consignacaoIds.length > 0) {
      queryBuilder.andWhere('i.consignacaoId IN (:...consignacaoIds)', { consignacaoIds: filter.consignacaoIds });
    }

    if (filter?.romaneiroIds && filter.romaneiroIds.length > 0) {
      queryBuilder.andWhere('i.romaneiroId IN (:...romaneiroIds)', { romaneiroIds: filter.romaneiroIds });
    }

    if (filter?.produtoIds && filter.produtoIds.length > 0) {
      queryBuilder.andWhere('i.produtoId IN (:...produtoIds)', { produtoIds: filter.produtoIds });
    }

    return queryBuilder.getMany();
  }
}
