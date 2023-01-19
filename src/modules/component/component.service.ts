import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { components } from './component.decorator';
import { ComponentEntity } from './entities/component.entity';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(ComponentEntity)
    private componentRepository: Repository<ComponentEntity>
  ) {}

  async popular(): Promise<void> {
    this.componentRepository.save(components);
  }

  async find(filter?: string, blocked?: boolean): Promise<ComponentEntity[]> {
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

  async findById(id: string): Promise<ComponentEntity> {
    return this.componentRepository.findOne({ where: { id } });
  }
}
