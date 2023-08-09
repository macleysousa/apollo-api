import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';
import { CorEntity } from './entities/cor.entity';

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

  async find(name?: string, active?: boolean | unknown): Promise<CorEntity[]> {
    return this.repository.find({
      where: { nome: ILike(`%${name ?? ''}%`), inativa: active == undefined ? undefined : Boolean(active) },
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

  async update(id: number, { nome: name, inativa: active }: UpdateCorDto): Promise<CorEntity> {
    const color = await this.findById(id);

    if (name) {
      color.nome = name;
    }

    if (active != undefined) {
      color.inativa = active;
    }

    return this.repository.save(color);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
