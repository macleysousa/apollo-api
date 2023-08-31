import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemFilter } from './filters/consignacao-item.filter';
import { UpsertConsignacaoItemDto } from './dto/upsert-consignacao-item.dto';
import { ContextService } from 'src/context/context.service';

@Injectable()
export class ConsignacaoItemService {
  constructor(
    @InjectRepository(ConsignacaoItemEntity)
    private readonly repository: Repository<ConsignacaoItemEntity>,
    private readonly contextService: ContextService
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

  async upsert(dto: UpsertConsignacaoItemDto[]): Promise<void> {
    const operadorId = this.contextService.operadorId();

    await this.repository.upsert([...dto.map((x) => ({ ...x, operadorId }))], {
      conflictPaths: ['consignacaoId', 'romaneioId', 'sequencia', 'produtoId'],
    });
  }
}
