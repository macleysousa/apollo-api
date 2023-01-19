import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubCategoryEntity } from './entities/sub.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategoryEntity)
    private repository: Repository<SubCategoryEntity>
  ) {}
  async create(categoryId: number, createSubDto: CreateSubDto): Promise<SubCategoryEntity> {
    const subByName = await this.findByName(categoryId, createSubDto.name);
    if (subByName) {
      throw new BadRequestException(`Sub Category with name ${createSubDto.name} already exists`);
    }
    const sub = await this.repository.save({ categoryId, ...createSubDto });
    return this.findById(categoryId, sub.id);
  }

  async find(categoryId: number, name?: string, active?: unknown): Promise<SubCategoryEntity[]> {
    return this.repository.find({
      where: { categoryId, name: ILike(`%${name ?? ''}%`), active: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findById(categoryId: number, id: number): Promise<SubCategoryEntity> {
    return this.repository.findOne({ where: { categoryId, id } });
  }

  async findByName(categoryId: number, name: string): Promise<SubCategoryEntity> {
    return this.repository.findOne({ where: { categoryId, name } });
  }

  async update(categoryId: number, id: number, updateSubDto: UpdateSubDto): Promise<SubCategoryEntity> {
    const subById = await this.findById(categoryId, id);
    if (!subById) {
      throw new BadRequestException(`Sub Category with id ${id} not found to category with id ${categoryId}`);
    }

    const subByName = await this.findByName(categoryId, updateSubDto.name);
    if (subByName && subByName.id != id) {
      throw new BadRequestException(`Sub Category with name ${updateSubDto.name} already exists in category with id ${categoryId}`);
    }

    await this.repository.update(id, updateSubDto);

    return this.findById(categoryId, id);
  }

  async remove(categoryId: number, id: number): Promise<void> {
    await this.repository.delete({ categoryId, id });
  }
}
