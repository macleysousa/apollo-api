import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaEntity } from './entities/marca.entity';

@Injectable()
export class MarcaService {
  constructor(
    @InjectRepository(MarcaEntity)
    private repository: Repository<MarcaEntity>,
  ) {}

  async create(createBrandDto: CreateMarcaDto): Promise<MarcaEntity> {
    const brandByName = await this.findByName(createBrandDto.nome);
    if (brandByName) {
      throw new BadRequestException(`Brand with name ${createBrandDto.nome} already exists`);
    }
    const brand = await this.repository.save(createBrandDto);
    return this.findById(brand.id);
  }

  async find(name?: string, active?: unknown): Promise<MarcaEntity[]> {
    return this.repository.find({
      where: { nome: ILike(`%${name ?? ''}%`), inativa: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findById(id: number): Promise<MarcaEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<MarcaEntity> {
    return this.repository.findOne({ where: { nome: name } });
  }

  async update(id: number, updateBrandDto: UpdateMarcaDto): Promise<MarcaEntity> {
    const brandByid = await this.findById(id);
    if (!brandByid) {
      throw new BadRequestException(`Brand with id ${id} not found`);
    }

    const brandByName = await this.findByName(updateBrandDto.nome);
    if (brandByName && brandByName.id !== id) {
      throw new BadRequestException(`Brand with name ${updateBrandDto.nome} already exists`);
    }

    await this.repository.update(id, updateBrandDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
