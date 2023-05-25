import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaEntity } from './entities/pessoa.entity';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(PessoaEntity)
    private repository: Repository<PessoaEntity>
  ) {}

  async create(empresaId: number, createPessoaDto: CreatePessoaDto): Promise<PessoaEntity> {
    const pessoaByDocumento = await this.findByDocumento(createPessoaDto.documento);
    if (pessoaByDocumento) {
      throw new BadRequestException(`Pessoa with documento ${createPessoaDto.documento} already exists`);
    }
    const pessoa = await this.repository.save({ ...createPessoaDto, empresaCadastro: empresaId, empresasAcesso: [empresaId, 2] });
    return this.findById(pessoa.id);
  }

  async find(searchTerm?: string, page = 1, limit = 100): Promise<Pagination<PessoaEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('p');
    queryBuilder.where({ id: Not(IsNull()) });

    if (searchTerm) {
      queryBuilder.orWhere({ id: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ nome: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ documento: ILike(`%${searchTerm}%`) });
    }

    return paginate<PessoaEntity>(queryBuilder, { page, limit });
  }

  async findById(id: number): Promise<PessoaEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findByDocumento(documento: string): Promise<PessoaEntity> {
    return this.repository.findOne({ where: { documento } });
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto): Promise<PessoaEntity> {
    await this.repository.update(id, updatePessoaDto);
    return this.findById(id);
  }

  async block(id: number): Promise<PessoaEntity> {
    const pessoa = await this.findById(id);
    if (!pessoa) {
      throw new BadRequestException(`Pessoa with id ${id} not found`);
    }
    await this.repository.update(id, { bloqueado: true });
    return this.findById(id);
  }

  async unblock(id: number): Promise<PessoaEntity> {
    const pessoa = await this.findById(id);
    if (!pessoa) {
      throw new BadRequestException(`Pessoa with id ${id} not found`);
    }
    await this.repository.update(id, { bloqueado: false });
    return this.findById(id);
  }

  async liberarAcesso(id: number, empresaId: number): Promise<PessoaEntity> {
    const pessoa = await this.findById(id);
    if (!pessoa) {
      throw new BadRequestException(`Pessoa with id ${id} not found`);
    }

    if (!pessoa.empresasAcesso.find((x) => x == empresaId)) pessoa.empresasAcesso.push(empresaId);

    await this.repository.save(pessoa);

    return this.findById(id);
  }
}
