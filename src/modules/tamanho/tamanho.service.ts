import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { TamanhoEntity } from './entities/tamanho.entity';

@Injectable()
export class TamanhoService {
  constructor(
    @InjectRepository(TamanhoEntity)
    private readonly repository: Repository<TamanhoEntity>
  ) {}

  async upsert(dto: CreateTamanhoDto[]): Promise<TamanhoEntity[]> {
    const tamanhos = await this.findByNames(dto.map((a) => a.nome));

    await this.repository.save(dto.map((a) => tamanhos.find((b) => b.nome == a.nome) ?? a).filter((c) => c));

    return this.findByNames(dto.map((a) => a.nome));
  }

  async create(createSizeDto: CreateTamanhoDto): Promise<TamanhoEntity> {
    const sizeById = await this.findById(createSizeDto.id);
    if (sizeById && sizeById.nome != createSizeDto.nome) {
      throw new BadRequestException(`Size with this id ${createSizeDto.id} already exists`);
    }

    const sizeByName = await this.findByName(createSizeDto.nome);
    if (sizeByName && sizeByName.id != createSizeDto.id) {
      throw new BadRequestException(`Size with this name ${createSizeDto.nome} already exists`);
    }

    const size = await this.repository.save(createSizeDto);

    return this.findById(size.id);
  }

  async find(nome?: string, inativo?: boolean | unknown): Promise<TamanhoEntity[]> {
    return this.repository.find({
      where: { nome: ILike(`%${nome ?? ''}%`), inativo: inativo == undefined ? undefined : Boolean(inativo) },
    });
  }

  async findById(id: number): Promise<TamanhoEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<TamanhoEntity> {
    return this.repository.findOne({ where: { nome: name } });
  }

  async findByNames(names: string[]): Promise<TamanhoEntity[]> {
    return this.repository.find({ where: { nome: In(names) } });
  }

  async update(id: number, updateSizeDto: UpdateTamanhoDto): Promise<TamanhoEntity> {
    const sizeById = await this.findById(id);
    if (!sizeById) {
      throw new BadRequestException(`Size with this id ${id} does not exist`);
    }

    const sizeByName = await this.findByName(updateSizeDto.nome);
    if (sizeByName && sizeByName.id != id) {
      throw new BadRequestException(`Size with this name ${updateSizeDto.nome} already exists`);
    }

    await this.repository.update(id, updateSizeDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
