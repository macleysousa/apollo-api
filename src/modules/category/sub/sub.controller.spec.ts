import { Test, TestingModule } from '@nestjs/testing';
import { categoryFakeRepository } from 'src/base-fake/category';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubCategoryController } from './sub.controller';
import { SubCategoryService } from './sub.service';

describe('SubController', () => {
  let controller: SubCategoryController;
  let service: SubCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoryController],
      providers: [
        {
          provide: SubCategoryService,
          useValue: {
            create: jest.fn().mockResolvedValue(categoryFakeRepository.findSubOne()),
            find: jest.fn().mockResolvedValue(categoryFakeRepository.findSub()),
            findById: jest.fn().mockResolvedValue(categoryFakeRepository.findSubOne()),
            update: jest.fn().mockResolvedValue(categoryFakeRepository.findSubOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubCategoryController>(SubCategoryController);
    service = module.get<SubCategoryService>(SubCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new sub category', async () => {
      // Arrange
      const categoryId = 1;
      const sub: CreateSubDto = { name: 'Name', active: true };

      // Act
      const result = await controller.create(categoryId, sub);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(categoryId, sub);

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return a list of sub categories', async () => {
      // Arrange
      const categoryId = 1;
      const name = undefined;
      const active = undefined;

      // Act
      const result = await controller.find(categoryId, name, active);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(categoryId, name, active);

      expect(result).toEqual(categoryFakeRepository.findSub());
    });
  });

  describe('/:subId (GET)', () => {
    it('should return a sub category', async () => {
      // Arrange
      const categoryId = 1;
      const subId = 1;

      // Act
      const result = await controller.findById(categoryId, subId);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(categoryId, subId);

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });
  });

  describe('/:subId (PUT)', () => {
    it('should update a sub category', async () => {
      // Arrange
      const subId = 1;
      const categoryId = 1;
      const sub: UpdateSubDto = { name: 'Name', active: true };

      // Act
      const result = await controller.update(categoryId, subId, sub);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(categoryId, subId, sub);

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });
  });

  describe('/:subId (DELETE)', () => {
    it('should delete a sub category', async () => {
      // Arrange
      const categoryId = 1;
      const subId = 1;

      // Act
      await controller.remove(categoryId, subId);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(categoryId, subId);
    });
  });
});
