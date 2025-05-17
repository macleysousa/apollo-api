import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { AddComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponenteGrupoItemEntity } from './entities/componente-grupo-item.entity';

@Injectable()
export class ComponenteGrupoItemService {
  constructor(
    @InjectRepository(ComponenteGrupoItemEntity)
    private repository: Repository<ComponenteGrupoItemEntity>,
  ) {}

  async add(grupoId: number, { componenteId }: AddComponentGroupItemDto): Promise<ComponenteGrupoItemEntity[]> {
    await this.repository.upsert({ grupoId, componenteId }, { conflictPaths: ['grupoId', 'componenteId'] });
    return this.findByGroup(grupoId);
  }

  async addList(grupoId: number, dtos: AddComponentGroupItemDto[]): Promise<ComponenteGrupoItemEntity[]> {
    await this.repository.upsert(
      dtos.map(({ componenteId }) => ({ grupoId, componenteId })),
      { conflictPaths: ['grupoId', 'componenteId'] },
    );

    if (dtos.length > 0) {
      await this.repository.delete({ grupoId, componenteId: Not(In(dtos.map((x) => x.componenteId))) });
    }

    return this.findByGroup(grupoId);
  }

  async findByGroup(grupoId: number, relations = ['componente']): Promise<ComponenteGrupoItemEntity[]> {
    return this.repository.find({ where: { grupoId }, relations });
  }

  async findByComponent(grupoId: number, componenteId: string, relations = ['componente']): Promise<ComponenteGrupoItemEntity> {
    return this.repository.findOne({ where: { grupoId: grupoId, componenteId }, relations });
  }

  async remove(grupoId: number, componenteId: string): Promise<void> {
    await this.repository.delete({ grupoId, componenteId });
  }
}
