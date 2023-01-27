import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productFakeRepository } from 'src/base-fake/product';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(productFakeRepository.findPaginate()),
}));

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(productFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              cache: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockReturnThis(),
              clone: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      // Arrange
      const createDto: CreateProductDto = { id: 1, name: 'test' };
      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createDto);

      expect(result).toEqual(productFakeRepository.findOne());
    });

    it('should not create a product error *Product with id ${createDto.id} already exists*', () => {
      // Arrange
      const createDto: CreateProductDto = { id: 1, name: 'test' };

      // Act

      // Assert
      expect(service.create(createDto)).rejects.toEqual(new BadRequestException(`Product with id ${createDto.id} already exists`));
    });
  });

  describe('find', () => {
    it('should find all products', async () => {
      // Arrange
      const searchTerm = 'test';

      // Act
      const result = await service.find(searchTerm);

      // Assert
      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('c');

      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledTimes(8);
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.measurementUnit', 'measurementUnit');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.color', 'color');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.size', 'size');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.category', 'category');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.subCategory', 'subCategory');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.reference', 'reference');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.brand', 'brand');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.barcodes', 'barcode');

      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ id: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ name: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ externalId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ measurementUnitId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ colorId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ sizeId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ categoryId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ subCategoryId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ referenceId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ brandId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith('barcode.code LIKE :barcode', { barcode: `%${searchTerm}%` });

      expect(result).toEqual(productFakeRepository.findPaginate());
    });
  });

  describe('findById', () => {
    it('should find a product by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, loadEagerRelations: true });

      expect(result).toEqual(productFakeRepository.findOne());
    });
  });
});
