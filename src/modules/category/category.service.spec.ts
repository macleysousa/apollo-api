import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryFakeRepository } from 'src/base-fake/category';
import { ILike, Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(categoryFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(categoryFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(categoryFakeRepository.findOne()),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      // Arrange
      const category: CreateCategoryDto = { id: 1, name: 'Name', active: true };
      //jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      // Act
      const result = await service.create(category);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(category);

      expect(result).toEqual(categoryFakeRepository.findOne());
    });

    it('should create a new category with error *Category with id ${createCategoryDto.id} already exists*', async () => {
      // Arrange
      const category: CreateCategoryDto = { id: 1, name: 'Test', active: true };

      // Act

      // Assert
      expect(service.create(category)).rejects.toEqual(new BadRequestException(`Category with id ${category.id} already exists`));
    });

    it('should create a new category with error *Category with name ${createCategoryDto.name} already exists*', async () => {
      // Arrange
      const category: CreateCategoryDto = { id: 2, name: 'Name', active: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.create(category)).rejects.toEqual(new BadRequestException(`Category with name ${category.name} already exists`));
    });
  });

  describe('find', () => {
    it('should find all categories with no filter', async () => {
      // Arrange
      const name = undefined;
      const active = undefined;

      // Act
      const result = await service.find(name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${''}%`), active: undefined },
      });

      expect(result).toEqual(categoryFakeRepository.find());
    });

    it('should find all categories with filter', async () => {
      // Arrange
      const name = 'Name';
      const active = true;

      // Act
      const result = await service.find(name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${name}%`), active },
      });

      expect(result).toEqual(categoryFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should find a category by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(categoryFakeRepository.findOne());
    });
  });

  describe('findByName', () => {
    it('should find a category by name', async () => {
      // Arrange
      const name = 'Name';

      // Act
      const result = await service.findByName(name);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name } });

      expect(result).toEqual(categoryFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      // Arrange
      const id = 1;
      const size: UpdateCategoryDto = { name: 'Name', active: true };

      // Act
      const result = await service.update(id, size);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, size);

      expect(result).toEqual(categoryFakeRepository.findOne());
    });

    it('should update a category with error *Category with id ${id} not found*', async () => {
      // Arrange
      const id = 1;
      const size: UpdateCategoryDto = { name: 'name', active: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Category with id ${id} not found`));
    });

    it('should update a category with error *Category with this name ${size.name} already exists*', async () => {
      // Arrange
      const id = 2;
      const size: UpdateCategoryDto = { name: 'name', active: true };

      // Act

      // Assert
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Category with name ${size.name} already exists`));
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      // Arrange
      const id = 1;

      // Act
      await service.remove(id);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
