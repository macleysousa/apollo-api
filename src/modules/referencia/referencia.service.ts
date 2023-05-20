import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { ReferenciaEntity } from './entities/referencia.entity';

@Injectable()
export class ReferenciaService {
  constructor(
    @InjectRepository(ReferenciaEntity)
    private referenceRepository: Repository<ReferenciaEntity>
  ) {}

  async create(createReferenceDto: CreateReferenciaDto): Promise<ReferenciaEntity> {
    const reference = await this.referenceRepository.save(createReferenceDto);

    return this.findById(reference.id);
  }

  async find(name?: string, externalId?: string): Promise<ReferenciaEntity[]> {
    return this.referenceRepository.find({
      where: { nome: ILike(`%${name ?? ''}%`), idExterno: ILike(`%${externalId ?? ''}%`) },
    });
  }

  async findById(id: number): Promise<ReferenciaEntity> {
    return this.referenceRepository.findOne({ where: { id } });
  }

  async update(id: number, updateReferenceDto: UpdateReferenciaDto): Promise<ReferenciaEntity> {
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
