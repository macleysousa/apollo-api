import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { TamanhoEntity } from './entities/tamanho.entity';
import { TamanhoFilter } from './filters/tamanho.filter';

@Injectable()
export class TamanhoService {
  constructor(
    @InjectRepository(TamanhoEntity)
    private readonly repository: Repository<TamanhoEntity>,
  ) {}

  async upsert(dto: CreateTamanhoDto[]): Promise<TamanhoEntity[]> {
    const tamanhos = await this.findByNames(dto.map((a) => a.nome));

    await this.repository.save(dto.map((a) => tamanhos.find((b) => b.nome == a.nome) ?? a).filter((c) => c));

    return this.findByNames(dto.map((a) => a.nome));
  }

  async create(createSizeDto: CreateTamanhoDto): Promise<TamanhoEntity> {
    if (createSizeDto.id) {
      const sizeById = await this.findById(createSizeDto.id);
      if (sizeById && sizeById.nome != createSizeDto.nome) {
        throw new BadRequestException(`Size with this id ${createSizeDto.id} already exists`, {
          description: 'O id do tamanho já existe e pertence a um tamanho diferente do informado no payload',
        });
      }
    }

    if (createSizeDto.nome) {
      const sizeByName = await this.findByName(createSizeDto.nome);
      if (sizeByName && sizeByName.id != createSizeDto.id) {
        throw new BadRequestException(`Size with this name ${createSizeDto.nome} already exists`, {
          description: 'O nome do tamanho já existe e pertence a um tamanho diferente do informado no payload',
        });
      }
    }

    const size = await this.repository.save(createSizeDto);

    return this.findById(size.id);
  }

  async find(filter?: TamanhoFilter): Promise<TamanhoEntity[]> {
    return this.repository.find({
      where: {
        nome: filter?.nome ? ILike(`%${filter.nome}%`) : undefined,
        inativo: filter?.inativo == undefined ? undefined : filter.inativo,
      },
      cache: filter?.cache ?? true,
    });
  }

  async findById(id: number): Promise<TamanhoEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(nome: string): Promise<TamanhoEntity> {
    return this.repository.findOne({ where: { nome } });
  }

  async findByNames(nomes: string[]): Promise<TamanhoEntity[]> {
    return this.repository.find({ where: { nome: In(nomes) } });
  }

  async update(id: number, updateSizeDto: UpdateTamanhoDto): Promise<TamanhoEntity> {
    const sizeById = await this.findById(id);
    if (!sizeById) {
      throw new BadRequestException(`Tamanho com id ${id} não encontrado`);
    }

    const sizeByName = await this.findByName(updateSizeDto.nome);
    if (sizeByName && sizeByName.id != id) {
      throw new BadRequestException(`Tamanho com nome ${updateSizeDto.nome} já existe`);
    }
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id }).catch((error) => {
      if (error.code === '23503') {
        throw new BadRequestException(`Tamanho com id ${id} não pode ser removido pois está sendo utilizado por outro registro`, {
          description: 'Não é possível excluir o tamanho, pois ele está sendo utilizado',
        });
      }

      throw new BadRequestException(error.message, {
        description: 'Não foi possível excluir o tamanho devido a um erro inesperado',
      });
    });
  }
}
