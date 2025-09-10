import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { UpdateComponentGroupDto } from './dto/atualizar-componente-grupo.dto';
import { CreateComponenteGrupoDto } from './dto/criar-componente-grupo.dto';
import { ComponenteGrupoEntity } from './entities/componente-grupo.entity';

@Injectable()
export class ComponenteGrupoService {
  constructor(
    @InjectRepository(ComponenteGrupoEntity)
    private repository: Repository<ComponenteGrupoEntity>,
  ) {}

  async create({ nome }: CreateComponenteGrupoDto): Promise<ComponenteGrupoEntity> {
    const group = await this.repository.save({ nome });
    return this.findById(group.id);
  }

  async find(name?: string): Promise<ComponenteGrupoEntity[]> {
    const query = this.repository.createQueryBuilder('grupo');
    query.leftJoinAndSelect('grupo.componentes', 'componentes');

    if (name) {
      query.where({ nome: ILike(`%${name}%`) });
    }

    return query.getMany();
  }

  async findById(id: number): Promise<ComponenteGrupoEntity> {
    return this.repository.findOne({ where: { id }, relations: ['componentes.componente'] });
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
