import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateTabelaDePrecoDto } from './dto/create-tabela-de-preco.dto';
import { UpdateTabelaDePrecoDto } from './dto/update-tabela-de-preco.dto';
import { TabelaDePrecoEntity } from './entities/tabela-de-preco.entity';

@Injectable()
export class TabelaDePrecoService {
  constructor(
    @InjectRepository(TabelaDePrecoEntity)
    private readonly repository: Repository<TabelaDePrecoEntity>
  ) {}

  async create(createTabelaDePrecoDto: CreateTabelaDePrecoDto): Promise<TabelaDePrecoEntity> {
    const tabela = await this.repository.save(createTabelaDePrecoDto);
    return this.findById(tabela.id);
  }

  async find(nome?: string, inativa?: boolean | unknown): Promise<TabelaDePrecoEntity[]> {
    return this.repository.find({
      where: { nome: ILike(`%${nome ?? ''}%`), inativa: inativa == undefined ? undefined : Boolean(inativa) },
    });
  }

  async findById(id: number): Promise<TabelaDePrecoEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateTabelaDePrecoDto: UpdateTabelaDePrecoDto): Promise<TabelaDePrecoEntity> {
    const tabela = await this.findById(id);
    if (!tabela) throw new BadRequestException('Tabela não encontrada');

    await this.repository.update(id, updateTabelaDePrecoDto);

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id).catch(() => {
      throw new BadRequestException('Não foi possível apagar a tabela de preço');
    });
  }
}
