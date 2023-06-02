import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';
import { CorEntity } from './entities/cor.entity';

@Injectable()
export class CorService {
  constructor(
    @InjectRepository(CorEntity)
    private colorRepository: Repository<CorEntity>
  ) {}

  async create(createColorDto: CreateCorDto): Promise<CorEntity> {
    return this.colorRepository.save(createColorDto);
  }

  async find(name?: string, active?: boolean | unknown): Promise<CorEntity[]> {
    return this.colorRepository.find({
      where: { nome: ILike(`%${name ?? ''}%`), inativa: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findById(id: number): Promise<CorEntity> {
    return this.colorRepository.findOne({ where: { id } });
  }

  async update(id: number, { nome: name, inativa: active }: UpdateCorDto): Promise<CorEntity> {
    const color = await this.findById(id);

    if (name) {
      color.nome = name;
    }

    if (active != undefined) {
      color.inativa = active;
    }

    return this.colorRepository.save(color);
  }

  async remove(id: number): Promise<void> {
    await this.colorRepository.delete({ id });
  }
}
