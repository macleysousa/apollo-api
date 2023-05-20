import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { TamanhoEntity } from './entities/tamanho.entity';

@Injectable()
export class TamanhoService {
  constructor(
    @InjectRepository(TamanhoEntity)
    private readonly sizeRepository: Repository<TamanhoEntity>
  ) {}

  async create(createSizeDto: CreateTamanhoDto): Promise<TamanhoEntity> {
    const sizeById = await this.findById(createSizeDto.id);
    if (sizeById && sizeById.nome != createSizeDto.nome) {
      throw new BadRequestException(`Size with this id ${createSizeDto.id} already exists`);
    }

    const sizeByName = await this.findByName(createSizeDto.nome);
    if (sizeByName && sizeByName.id != createSizeDto.id) {
      throw new BadRequestException(`Size with this name ${createSizeDto.nome} already exists`);
    }

    const size = await this.sizeRepository.save(createSizeDto);

    return this.findById(size.id);
  }

  async find(name?: string, active?: boolean | unknown): Promise<TamanhoEntity[]> {
    return this.sizeRepository.find({
      where: { nome: ILike(`%${name ?? ''}%`), inativo: active == undefined ? undefined : Boolean(active) },
    });
  }

  async findById(id: number): Promise<TamanhoEntity> {
    return this.sizeRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<TamanhoEntity> {
    return this.sizeRepository.findOne({ where: { nome: name } });
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

    await this.sizeRepository.update(id, updateSizeDto);

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.sizeRepository.delete({ id });
  }
}
