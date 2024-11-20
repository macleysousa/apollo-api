import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { CreateSubCategoriaDto } from './dto/create-sub.dto';
import { UpdateSubCategoriaDto } from './dto/update-sub.dto';
import { SubCategoriaEntity } from './entities/sub.entity';

@Injectable()
export class SubCategoriaService {
  constructor(
    @InjectRepository(SubCategoriaEntity)
    private repository: Repository<SubCategoriaEntity>,
  ) {}

  async upsert(dto: CreateSubCategoriaDto[]): Promise<SubCategoriaEntity[]> {
    const subs = await this.findByNames(
      undefined,
      dto.map((c) => c.nome),
    );

    await this.repository.save(
      dto.map((c) => subs.find((cat) => cat.categoriaId == c.categoriaId && cat.nome == c.nome) ?? c).filter((c) => c),
    );

    return this.findByNames(
      null,
      dto.map((c) => c.nome),
    );
  }

  async create(categoriaId: number, createSubDto: CreateSubCategoriaDto): Promise<SubCategoriaEntity> {
    const subByName = await this.findByName(categoriaId, createSubDto.nome);
    if (subByName) {
      throw new BadRequestException(`Sub Category with name ${createSubDto.nome} already exists`);
    }
    const sub = await this.repository.save({ categoriaId, ...createSubDto });
    return this.findById(categoriaId, sub.id);
  }

  async find(categoryId: number, name?: string, active?: unknown): Promise<SubCategoriaEntity[]> {
    return this.repository.find({
      where: {
        categoriaId: categoryId,
        nome: ILike(`%${name ?? ''}%`),
        inativa: active == undefined ? undefined : Boolean(active),
      },
    });
  }

  async findById(categoryId: number, id: number): Promise<SubCategoriaEntity> {
    return this.repository.findOne({ where: { categoriaId: categoryId, id } });
  }

  async findByName(categoryId: number, name: string): Promise<SubCategoriaEntity> {
    return this.repository.findOne({ where: { categoriaId: categoryId, nome: name } });
  }

  async findByNames(categoriaId: number, names: string[]): Promise<SubCategoriaEntity[]> {
    return this.repository.find({ where: { categoriaId, nome: In(names) } });
  }

  async update(categoryId: number, id: number, updateSubDto: UpdateSubCategoriaDto): Promise<SubCategoriaEntity> {
    const subById = await this.findById(categoryId, id);
    if (!subById) {
      throw new BadRequestException(`Sub Category with id ${id} not found to category with id ${categoryId}`);
    }

    const subByName = await this.findByName(categoryId, updateSubDto.nome);
    if (subByName && subByName.id != id) {
      throw new BadRequestException(
        `Sub Category with name ${updateSubDto.nome} already exists in category with id ${categoryId}`,
      );
    }

    await this.repository.update(id, updateSubDto);

    return this.findById(categoryId, id);
  }

  async remove(categoryId: number, id: number): Promise<void> {
    await this.repository.delete({ categoriaId: categoryId, id });
  }
}
