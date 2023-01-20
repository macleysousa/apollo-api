import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandEntity } from './entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private repository: Repository<BrandEntity>
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    const brandByName = await this.findByName(createBrandDto.name);
    if (brandByName) {
      throw new BadRequestException(`Brand with name ${createBrandDto.name} already exists`);
    }
    const brand = await this.repository.save(createBrandDto);
    return this.findById(brand.id);
  }

  async find(name?: string, active?: unknown): Promise<BrandEntity[]> {
    return this.repository.find({
      where: { name: ILike(`%${name ?? ''}%`), active: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findById(id: number): Promise<BrandEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<BrandEntity> {
    return this.repository.findOne({ where: { name } });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<BrandEntity> {
    const brandByid = await this.findById(id);
    if (!brandByid) {
      throw new BadRequestException(`Brand with id ${id} not found`);
    }

    const brandByName = await this.findByName(updateBrandDto.name);
    if (brandByName && brandByName.id !== id) {
      throw new BadRequestException(`Brand with name ${updateBrandDto.name} already exists`);
    }

    await this.repository.update(id, updateBrandDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
