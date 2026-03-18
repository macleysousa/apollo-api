import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';
import { BASE_CORES_INICIAL } from './data/base-cores-inicial.data';
import { CorEntity } from './entities/cor.entity';
import { CorFilter } from './filters/cor.filter';

@Injectable()
export class CorService {
  constructor(
    @InjectRepository(CorEntity)
    private repository: Repository<CorEntity>,
  ) {}

  async upsert(dto: CreateCorDto[]): Promise<CorEntity[]> {
    const cores = await this.findByNames(dto.map((c) => c.nome));

    await this.repository.save(dto.map((c) => cores.find((cat) => cat.nome == c.nome) ?? c).filter((c) => c));

    return this.findByNames(dto.map((c) => c.nome));
  }

  async popularBaseInicialSeHabilitada(): Promise<void> {
    if (!this.parseBooleanFilter(process.env.BASE_DE_CORES_INICIAL)) {
      return;
    }

    const nomes = BASE_CORES_INICIAL.map((cor) => cor.nome);
    const coresExistentes = await this.findByNames(nomes);

    if (coresExistentes.length > 0) {
      return;
    }

    const faltantes = BASE_CORES_INICIAL.filter((cor) => !coresExistentes.some((existente) => existente.nome === cor.nome));

    if (!faltantes.length) {
      return;
    }

    await this.repository.save(faltantes);
  }

  async create(createColorDto: CreateCorDto): Promise<CorEntity> {
    return this.repository.save(createColorDto);
  }

  async find(filter?: CorFilter): Promise<CorEntity[]> {
    const colors = await this.repository.find({
      where: {
        nome: filter?.nome ? ILike(`%${filter.nome}%`) : undefined,
        inativa: filter?.inativa == undefined ? undefined : filter.inativa,
      },
      cache: filter?.cache ?? true,
    });

    if (this.parseBooleanFilter(filter?.carregarTags)) {
      return colors;
    }

    return colors.map((color) => new CorEntity({ ...color, tags: undefined }));
  }

  async findById(id: number, carregarTags?: boolean | string): Promise<CorEntity> {
    const color = await this.repository.findOne({ where: { id } });

    if (!color) {
      return color;
    }

    if (this.parseBooleanFilter(carregarTags)) {
      return color;
    }

    return new CorEntity({ ...color, tags: undefined });
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

  private parseBooleanFilter(value?: boolean | string): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (!value) {
      return false;
    }

    return ['1', 'true', 't', 'yes', 'y', 'sim', 's'].includes(value.toLowerCase());
  }
}
