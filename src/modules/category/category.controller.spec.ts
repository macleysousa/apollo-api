import { Test, TestingModule } from '@nestjs/testing';

import { categoryFakeRepository } from 'src/base-fake/category';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
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

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new category', async () => {
      // Arrange
      const category: CreateCategoryDto = { id: 1, name: 'Name', active: true };

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
      const category: UpdateCategoryDto = { name: 'Name', active: true };

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
