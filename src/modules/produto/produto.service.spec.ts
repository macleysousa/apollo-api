import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { productFakeRepository } from 'src/base-fake/product';

import { CreateProdutoDto } from './dto/create-produto.dto';
import { ProdutoEntity } from './entities/produto.entity';
import { ProdutoService } from './produto.service';
import { UpdateProdutoDto } from './dto/update-produto.dto';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(productFakeRepository.findPaginate()),
}));

describe('ProductService', () => {
  let service: ProdutoService;
  let repository: Repository<ProdutoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getRepositoryToken(ProdutoEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(productFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            delete: jest.fn().mockResolvedValue(Promise<void>),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
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

    service = module.get<ProdutoService>(ProdutoService);
    repository = module.get<Repository<ProdutoEntity>>(getRepositoryToken(ProdutoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      // Arrange
      const createDto: CreateProdutoDto = { id: 1, corId: 1 };
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
      const createDto: CreateProdutoDto = { id: 1, corId: 1 };

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

      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledTimes(4);
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.cor', 'cor');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.tamanho', 'tamanho');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.referencia', 'referencia');
      expect(repository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('c.codigos', 'codigo');

      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledTimes(6);
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ id: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ nome: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ idExterno: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ referenciaId: ILike(`%${searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith('referencia.idExterno LIKE :idExterno', {
        idExterno: `%${searchTerm}%`,
      });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith('codigo.code LIKE :codigo', { codigo: `%${searchTerm}%` });

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

  describe('update', () => {
    it('should update a product', async () => {
      // Arrange
      const productId = 1;
      const updateDto = new UpdateProdutoDto({ name: 'Updated Product 1' });

      // Act
      const result = await service.update(productId, updateDto);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(productId, updateDto);

      expect(result).toEqual(productFakeRepository.findOne());
    });

    it('should not update a product error *Product with id ${id} not found*', () => {
      // Arrange
      const id = 1;
      const updateDto: UpdateProdutoDto = { corId: 1 };
      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      // Act

      // Assert
      expect(service.update(id, updateDto)).rejects.toEqual(new BadRequestException(`Product with id ${id} not found`));
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      // Arrange
      const productId = 1;

      // Act
      await service.remove(productId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith({ id: productId });
    });

    it('should throw BadRequestException *Unable to delete product with id ${id}*', async () => {
      // Arrange
      const productId = 1;
      jest.spyOn(repository, 'delete').mockRejectedValueOnce(() => {
        throw new BadRequestException(`Unable to delete product with id ${productId}`);
      });

      // Act

      // Assert
      expect(service.remove(productId)).rejects.toThrow(BadRequestException);
    });
  });
});
