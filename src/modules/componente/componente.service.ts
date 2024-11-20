import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { components } from '../../decorators/api-componente.decorator';

import { ComponenteEntity } from './entities/componente.entity';

@Injectable()
export class ComponenteService {
  constructor(
    @InjectRepository(ComponenteEntity)
    private componentRepository: Repository<ComponenteEntity>,
  ) {}

  async popular(): Promise<void> {
    this.componentRepository.save(components);
  }

  async find(filter?: string, blocked?: boolean): Promise<ComponenteEntity[]> {
    const queryBuilder = this.componentRepository.createQueryBuilder('c');
    queryBuilder.where({ id: Not(IsNull()) });

    if (filter) {
      queryBuilder.andWhere({ id: ILike(`%${filter}%`) });
      queryBuilder.andWhere({ name: ILike(`%${filter}%`) });
    }

    if (blocked) {
      queryBuilder.andWhere({ blocked: blocked });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<ComponenteEntity> {
    return this.componentRepository.findOne({ where: { id } });
  }
}
