import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ILike, Repository } from 'typeorm';

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

  async find(searchTerm?: string, page = 1, limit = 100): Promise<Pagination<ProductEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.leftJoinAndSelect('c.measurementUnit', 'measurementUnit');
    queryBuilder.leftJoinAndSelect('c.color', 'color');
    queryBuilder.leftJoinAndSelect('c.size', 'size');
    queryBuilder.leftJoinAndSelect('c.category', 'category');
    queryBuilder.leftJoinAndSelect('c.subCategory', 'subCategory');
    queryBuilder.leftJoinAndSelect('c.reference', 'reference');
    queryBuilder.leftJoinAndSelect('c.brand', 'brand');
    queryBuilder.leftJoinAndSelect('c.barcodes', 'barcode');

    if (searchTerm) {
      queryBuilder.orWhere({ id: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ name: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ externalId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ measurementUnitId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ colorId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ sizeId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ categoryId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ subCategoryId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ referenceId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere({ brandId: ILike(`%${searchTerm}%`) });
      queryBuilder.orWhere('barcode.code LIKE :barcode', { barcode: `%${searchTerm}%` });
    }

    return paginate<ProductEntity>(queryBuilder, { page, limit });
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
