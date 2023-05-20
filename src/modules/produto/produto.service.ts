import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoEntity } from './entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private repository: Repository<ProdutoEntity>
  ) {}

  async create(createDto: CreateProdutoDto): Promise<ProdutoEntity> {
    const valueById = await this.findById(createDto.id);
    if (valueById && valueById.id == createDto.id) {
      throw new BadRequestException(`Product with id ${createDto.id} already exists`);
    }
    const product = await this.repository.save(createDto);
    return this.findById(product.id);
  }

  async find(searchTerm?: string, page = 1, limit = 100): Promise<Pagination<ProdutoEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.where({ id: Not(IsNull()) });

    queryBuilder.leftJoinAndSelect('c.cor', 'cor');
    queryBuilder.leftJoinAndSelect('c.tamanho', 'tamanho');
    queryBuilder.leftJoinAndSelect('c.referencia', 'referencia');
    queryBuilder.leftJoinAndSelect('c.codigos', 'codigo');

    if (searchTerm) {
      queryBuilder.orWhere({ id: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ nome: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ idExterno: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ referenciaId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere('referencia.idExterno LIKE :idExterno', { idExterno: `%${searchTerm}%` });
      queryBuilder.orWhere('codigo.code LIKE :codigo', { codigo: `%${searchTerm}%` });
    }

    return paginate<ProdutoEntity>(queryBuilder, { page, limit });
  }

  async findById(id: number): Promise<ProdutoEntity> {
    return this.repository.findOne({ where: { id }, loadEagerRelations: true });
  }

  async update(id: number, updateDto: UpdateProdutoDto): Promise<ProdutoEntity> {
    const valueById = await this.findById(id);
    if (!valueById) {
      throw new BadRequestException(`Product with id ${id} not found`);
    }
    await this.repository.update(id, updateDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete({ id }).catch(() => {
      throw new BadRequestException(`Unable to delete product with id ${id}`);
    });
  }
}
