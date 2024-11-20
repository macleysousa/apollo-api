import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { CreateCategoriaDto } from './dto/create-category.dto';
import { UpdateCategoriaDto } from './dto/update-category.dto';
import { CategoriaEntity } from './entities/category.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(CategoriaEntity)
    private repository: Repository<CategoriaEntity>,
  ) {}

  async upsert(createCategoryDto: CreateCategoriaDto[]): Promise<CategoriaEntity[]> {
    const categorias = await this.findByNames(createCategoryDto.map((c) => c.nome));

    await this.repository.save(createCategoryDto.map((c) => categorias.find((cat) => cat.nome == c.nome) ?? c).filter((c) => c));

    return this.findByNames(createCategoryDto.map((c) => c.nome));
  }

  async create(createCategoryDto: CreateCategoriaDto): Promise<CategoriaEntity> {
    const categoryById = await this.findById(createCategoryDto.id);
    if (categoryById && createCategoryDto.id > 0 && categoryById.nome != createCategoryDto.nome) {
      throw new BadRequestException(`Category with id ${createCategoryDto.id} already exists`);
    }

    const categoryByName = await this.findByName(createCategoryDto.nome);
    if (categoryByName && categoryByName.id != createCategoryDto.id) {
      throw new BadRequestException(`Category with name ${createCategoryDto.nome} already exists`);
    }

    const category = await this.repository.save(createCategoryDto);

    return this.findById(category.id);
  }

  async find(name?: string, active?: unknown): Promise<CategoriaEntity[]> {
    return this.repository.find({
      where: { nome: ILike(`%${name ?? ''}%`), inativa: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findByNames(names: string[]): Promise<CategoriaEntity[]> {
    return this.repository.find({ where: { nome: In(names) } });
  }

  async findById(id: number): Promise<CategoriaEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<CategoriaEntity> {
    return this.repository.findOne({ where: { nome: name } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoriaDto): Promise<CategoriaEntity> {
    const categoryById = await this.findById(id);
    if (!categoryById) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }

    const categoryByName = await this.findByName(updateCategoryDto.nome);
    if (categoryByName && categoryByName.id != id) {
      throw new BadRequestException(`Category with name ${updateCategoryDto.nome} already exists`);
    }

    await this.repository.update(id, updateCategoryDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
