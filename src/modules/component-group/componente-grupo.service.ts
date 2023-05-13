import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateComponenteGrupoDto } from './dto/criar-componente-grupo.dto';
import { UpdateComponentGroupDto } from './dto/atualizar-componente-grupo.dto';
import { ComponenteGrupoEntity } from './entities/componente-grupo.entity';

@Injectable()
export class ComponenteGrupoService {
  constructor(
    @InjectRepository(ComponenteGrupoEntity)
    private repository: Repository<ComponenteGrupoEntity>
  ) {}

  async create({ nome }: CreateComponenteGrupoDto): Promise<ComponenteGrupoEntity> {
    const group = await this.repository.save({ nome });
    return this.findById(group.id);
  }

  async find(name?: string, relations: string[] = ['itens']): Promise<ComponenteGrupoEntity[]> {
    return this.repository.find({ where: { nome: ILike(`%${name ?? ''}%`) }, relations });
  }

  async findById(id: number, relations: string[] = ['itens']): Promise<ComponenteGrupoEntity> {
    return this.repository.findOne({ where: { id }, relations });
  }

  async update(id: number, { nome: name }: UpdateComponentGroupDto): Promise<ComponenteGrupoEntity> {
    const group = await this.findById(id);

    if (!group) {
      throw new BadRequestException(`Group with id ${id} not found`);
    }

    if (name) {
      group.nome = name;
    }

    await this.repository.save(group);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const group = await this.findById(id);

    if (!group) {
      throw new BadRequestException(`Group with id ${id} not found`);
    }

    await this.repository.delete({ id });
  }
}
