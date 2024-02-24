import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';
import { CorEntity } from './entities/cor.entity';
import { CorFilter } from './filters/cor.filter';

@Injectable()
export class CorService {
  constructor(
    @InjectRepository(CorEntity)
    private repository: Repository<CorEntity>
  ) {}

  async upsert(dto: CreateCorDto[]): Promise<CorEntity[]> {
    const cores = await this.findByNames(dto.map((c) => c.nome));

    await this.repository.save(dto.map((c) => cores.find((cat) => cat.nome == c.nome) ?? c).filter((c) => c));

    return this.findByNames(dto.map((c) => c.nome));
  }

  async create(createColorDto: CreateCorDto): Promise<CorEntity> {
    return this.repository.save(createColorDto);
  }

  async find(filter?: CorFilter): Promise<CorEntity[]> {
    return this.repository.find({
      where: {
        nome: filter?.nome ? ILike(`%${filter.nome}%`) : undefined,
        inativa: filter?.inativa == undefined ? undefined : filter.inativa,
      },
      cache: filter?.cache ?? true,
    });
  }

  async findById(id: number): Promise<CorEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<CorEntity> {
    return this.repository.findOne({ where: { nome: name } });
  }

  async findByNames(names: string[]): Promise<CorEntity[]> {
    return this.repository.find({ where: { nome: In(names) } });
  }

  async update(id: number, dto: UpdateCorDto): Promise<CorEntity> {
    await this.repository.update({ id }, dto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
