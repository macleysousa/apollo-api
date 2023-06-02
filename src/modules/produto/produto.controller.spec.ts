import { Test, TestingModule } from '@nestjs/testing';
import { productFakeRepository } from 'src/base-fake/product';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';

describe('ProductController', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: {
            create: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(productFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(productFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new product', async () => {
      // Arrange
      const value: CreateProdutoDto = { corId: 1 };

      // Act
      const result = await controller.create(value);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(value);

      expect(result).toEqual(productFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return a list of products', async () => {
      // Arrange
      const searchTerm = undefined;
      const page = 1;
      const limit = 10;

      // Act
      const result = await controller.find(searchTerm, page, limit);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(searchTerm, page, limit);

      expect(result).toEqual(productFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should return a product', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id);

      expect(result).toEqual(productFakeRepository.findOne());
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a product', async () => {
      // Arrange
      const id = 1;
      const value: UpdateProdutoDto = { corId: 1 };

      // Act
      const result = await controller.update(id, value);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, value);

      expect(result).toEqual(productFakeRepository.findOne());
    });
  });

  describe('/:id (DELETE)', () => {
    it('should delete a product', async () => {
      // Arrange
      const id = 1;

      // Act
      await controller.remove(id);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
