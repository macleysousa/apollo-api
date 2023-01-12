import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { ReferenceEntity } from './entities/reference.entity';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(ReferenceEntity)
    private referenceRepository: Repository<ReferenceEntity>
  ) {}

  async create(createReferenceDto: CreateReferenceDto): Promise<ReferenceEntity> {
    const reference = await this.referenceRepository.save(createReferenceDto);

    return this.findById(reference.id);
  }

  async find(name?: string, externalId?: string): Promise<ReferenceEntity[]> {
    return this.referenceRepository.find({
      where: { name: ILike(`%${name ?? ''}%`), externalId: ILike(`%${externalId ?? ''}%`) },
    });
  }

  async findById(id: number): Promise<ReferenceEntity> {
    return this.referenceRepository.findOne({ where: { id } });
  }

  async update(id: number, updateReferenceDto: UpdateReferenceDto): Promise<ReferenceEntity> {
    const reference = await this.findById(id);
    if (!reference) {
      throw new BadRequestException('Reference not found');
    }
    await this.referenceRepository.save({ ...reference, ...updateReferenceDto });

    return await this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.referenceRepository.delete({ id });
  }
}
