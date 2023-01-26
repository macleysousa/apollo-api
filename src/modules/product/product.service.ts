import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>
  ) {}

  async create(createDto: CreateProductDto): Promise<ProductEntity> {
    const valueById = await this.findById(createDto.id);
    if (valueById && valueById.id == createDto.id) {
      throw new BadRequestException(`Product with id ${createDto.id} already exists`);
    }
    const product = await this.repository.save(createDto);
    return this.findById(product.brandId);
  }

  async find(id?: number, name?: string, externalId?: string, barcode?: string, page = 1, limit = 100): Promise<Pagination<ProductEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.where({ id: Not(IsNull()) });
    queryBuilder.innerJoinAndSelect('c.barcodes', 'barcode');

    if (id) queryBuilder.andWhere({ id: id });

    if (name) queryBuilder.andWhere({ name: ILike(`%${name}%`) });

    if (externalId) queryBuilder.andWhere({ externalId: ILike(`%${externalId}%`) });

    if (barcode) queryBuilder.andWhere('barcode.code LIKE :barcode', { barcode: `%${barcode}%` });

    return paginate<ProductEntity>(queryBuilder, { page, limit });
  }

  async findByBarcode(barcode: string): Promise<ProductEntity[]> {
    return this.repository.find({ where: { barcodes: [{ code: barcode }] }, loadEagerRelations: true });
  }

  async findById(id: number): Promise<ProductEntity> {
    return this.repository.findOne({ where: { id }, loadEagerRelations: true });
  }

  async update(id: number, updateDto: UpdateProductDto): Promise<ProductEntity> {
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
