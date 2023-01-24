import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMeasurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnitEntity } from './entities/measurement-unit.entity';

@Injectable()
export class MeasurementUnitService {
  constructor(
    @InjectRepository(MeasurementUnitEntity)
    private repository: Repository<MeasurementUnitEntity>
  ) {}

  async create(createDto: CreateMeasurementUnitDto): Promise<MeasurementUnitEntity> {
    const valueByName = await this.findByName(createDto.name);
    if (valueByName) {
      throw new BadRequestException(`Unit measure with name ${createDto.name} already exists`);
    }
    const value = await this.repository.save(createDto);
    return this.findById(value.id);
  }

  async find(name?: string, active?: unknown): Promise<MeasurementUnitEntity[]> {
    return this.repository.find({
      where: { name: ILike(`%${name ?? ''}%`), active: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findById(id: number): Promise<MeasurementUnitEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<MeasurementUnitEntity> {
    return this.repository.findOne({ where: { name } });
  }

  async update(id: number, updateDto: UpdateMeasurementUnitDto): Promise<MeasurementUnitEntity> {
    const valueByid = await this.findById(id);
    if (!valueByid) {
      throw new BadRequestException(`Unit measure with id ${id} not found`);
    }

    const valueByName = await this.findByName(updateDto.name);
    if (valueByName && valueByName.id !== id) {
      throw new BadRequestException(`Unit measure with name ${updateDto.name} already exists`);
    }

    await this.repository.update(id, updateDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
