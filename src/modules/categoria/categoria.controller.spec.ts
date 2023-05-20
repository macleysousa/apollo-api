import { Test, TestingModule } from '@nestjs/testing';

import { categoryFakeRepository } from 'src/base-fake/category';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-category.dto';
import { UpdateCategoriaDto } from './dto/update-category.dto';

describe('CategoryController', () => {
  let controller: CategoriaController;
  let service: CategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: CategoriaService,
          useValue: {
            create: jest.fn().mockResolvedValue(categoryFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(categoryFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(categoryFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(categoryFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
    service = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new category', async () => {
      // Arrange
      const category: CreateCategoriaDto = { id: 1, nome: 'Name', inativa: true };

      // Act
      const result = await controller.create(category);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(category);

      expect(result).toEqual(categoryFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return a list of categories', async () => {
      // Arrange
      const name = undefined;
      const active = undefined;

      // Act
      const result = await controller.find(name, active);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(name, active);

      expect(result).toEqual(categoryFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should return a category', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id);

      expect(result).toEqual(categoryFakeRepository.findOne());
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a category', async () => {
      // Arrange
      const id = 1;
      const category: UpdateCategoriaDto = { nome: 'Name', inativa: true };

      // Act
      const result = await controller.update(id, category);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, category);

      expect(result).toEqual(categoryFakeRepository.findOne());
    });
  });

  describe('/:id (DELETE)', () => {
    it('should delete a category', async () => {
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
