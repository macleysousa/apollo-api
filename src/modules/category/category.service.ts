import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const categoryById = await this.findById(createCategoryDto.id);
    if (categoryById && createCategoryDto.id > 0 && categoryById.name != createCategoryDto.name) {
      throw new BadRequestException(`Category with id ${createCategoryDto.id} already exists`);
    }

    const categoryByName = await this.findByName(createCategoryDto.name);
    if (categoryByName && categoryByName.id != createCategoryDto.id) {
      throw new BadRequestException(`Category with name ${createCategoryDto.name} already exists`);
    }

    const category = await this.repository.save(createCategoryDto);

    return this.findById(category.id);
  }

  async find(name?: string, active?: unknown): Promise<CategoryEntity[]> {
    return this.repository.find({
      where: { name: ILike(`%${name ?? ''}%`), active: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findById(id: number): Promise<CategoryEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<CategoryEntity> {
    return this.repository.findOne({ where: { name } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const categoryById = await this.findById(id);
    if (!categoryById) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }

    const categoryByName = await this.findByName(updateCategoryDto.name);
    if (categoryByName && categoryByName.id != id) {
      throw new BadRequestException(`Category with name ${updateCategoryDto.name} already exists`);
    }

    await this.repository.update(id, updateCategoryDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
