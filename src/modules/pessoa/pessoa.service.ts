import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoaFilter } from './filters/pessoa.filter';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(PessoaEntity)
    private repository: Repository<PessoaEntity>,
  ) {}

  async create(empresaId: number, createPessoaDto: CreatePessoaDto): Promise<PessoaEntity> {
    const pessoaByDocumento = await this.findByDocumento(createPessoaDto.documento);
    if (pessoaByDocumento) {
      throw new BadRequestException(`Pessoa com documento ${createPessoaDto.documento} já cadastrada`);
    }
    const pessoa = await this.repository.save({ ...createPessoaDto, empresaCadastro: empresaId, empresasAcesso: [empresaId] });
    return this.findById(pessoa.id);
  }

  async find(filter: PessoaFilter): Promise<Pagination<PessoaEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('p');
    queryBuilder.where({ id: Not(IsNull()) });

    if (filter && filter.searchTerm) {
      queryBuilder.andWhere('(p.id :searchTerm OR p.nome LIKE :searchTerm OR p.documento LIKE :searchTerm)', {
        searchTerm: `%${filter.searchTerm}%`,
      });
    }

    if (filter && filter.empresaIds?.length > 0) {
      queryBuilder.andWhere(`p.empresasAcesso IN (:...empresaIds)`, { empresaIds: filter.empresaIds });
    }

    if (filter && filter.name) {
      queryBuilder.andWhere('p.nome LIKE :name', { name: `%${filter.name}%` });
    }

    if (filter && filter.document) {
      queryBuilder.andWhere('p.documento LIKE :document', { document: `%${filter.document}%` });
    }

    if (filter && filter.bloqueado !== undefined) {
      queryBuilder.andWhere('p.bloqueado = :bloqueado', { bloqueado: filter.bloqueado });
    }

    return paginate<PessoaEntity>(queryBuilder, { page: filter.pagina, limit: filter.itemsPorPagina });
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
      throw new BadRequestException(`Pessoa com id ${id} não encontrada`);
    }
    await this.repository.update(id, { bloqueado: true });
    return this.findById(id);
  }

  async unblock(id: number): Promise<PessoaEntity> {
    const pessoa = await this.findById(id);
    if (!pessoa) {
      throw new BadRequestException(`Pessoa com id ${id} não encontrada`);
    }
    await this.repository.update(id, { bloqueado: false });
    return this.findById(id);
  }

  async liberarAcesso(id: number, empresaId: number): Promise<PessoaEntity> {
    const pessoa = await this.findById(id);
    if (!pessoa) {
      throw new BadRequestException(`Pessoa com id ${id} não encontrada`);
    }

    if (!pessoa.empresasAcesso.find((x) => x == empresaId)) pessoa.empresasAcesso.push(empresaId);

    await this.repository.save(pessoa);

    return this.findById(id);
  }
}
