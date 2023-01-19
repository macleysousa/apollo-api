import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryFakeRepository } from 'src/base-fake/category';
import { ILike, Repository } from 'typeorm';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubCategoryEntity } from './entities/sub.entity';
import { SubCategoryService } from './sub.service';

describe('SubService', () => {
  let service: SubCategoryService;
  let repository: Repository<SubCategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoryService,
        {
          provide: getRepositoryToken(SubCategoryEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(categoryFakeRepository.findSubOne()),
            find: jest.fn().mockResolvedValue(categoryFakeRepository.findSub()),
            findOne: jest.fn().mockResolvedValue(categoryFakeRepository.findSubOne()),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubCategoryService>(SubCategoryService);
    repository = module.get<Repository<SubCategoryEntity>>(getRepositoryToken(SubCategoryEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      // Arrange
      const categoryId = 1;
      const sub: CreateSubDto = { name: 'Name', active: true };
      jest.spyOn(service, 'findByName').mockResolvedValue(undefined);

      // Act
      const result = await service.create(categoryId, sub);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({ categoryId, ...sub });

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });

    it('should create a new category with error *Category with name ${createCategoryDto.name} already exists*', async () => {
      // Arrange
      const categoryId = 1;
      const sub: CreateSubDto = { name: 'Name', active: true };

      // Act

      // Assert
      expect(service.create(categoryId, sub)).rejects.toEqual(new BadRequestException(`Sub Category with name ${sub.name} already exists`));
    });
  });

  describe('find', () => {
    it('should find all subs categories with no filter', async () => {
      // Arrange
      const categoryId = 1;
      const name = undefined;
      const active = undefined;

      // Act
      const result = await service.find(categoryId, name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { categoryId, name: ILike(`%${''}%`), active: undefined },
      });

      expect(result).toEqual(categoryFakeRepository.findSub());
    });

    it('should find all sub categories with filter', async () => {
      // Arrange
      const categoryId = 1;
      const name = 'Name';
      const active = true;

      // Act
      const result = await service.find(categoryId, name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { categoryId, name: ILike(`%${name}%`), active },
      });

      expect(result).toEqual(categoryFakeRepository.findSub());
    });
  });

  describe('findById', () => {
    it('should find a sub category by categoryId and id', async () => {
      // Arrange
      const categoryId = 1;
      const id = 1;

      // Act
      const result = await service.findById(categoryId, id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id, categoryId } });

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });
  });

  describe('findByName', () => {
    it('should find a sub category by categoryId and name', async () => {
      // Arrange
      const categoryId = 1;
      const name = 'Name';

      // Act
      const result = await service.findByName(categoryId, name);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { categoryId, name } });

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });
  });

  describe('update', () => {
    it('should update a sub category', async () => {
      // Arrange
      const categoryId = 1;
      const id = 1;
      const size: UpdateCategoryDto = { name: 'Name', active: true };

      // Act
      const result = await service.update(categoryId, id, size);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, size);

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });

    it('should update a sub category with error *Sub Category with id ${id} not found to category with id ${categoryId}*', async () => {
      // Arrange
      const categoryId = 1;
      const id = 1;
      const size: UpdateSubDto = { name: 'name', active: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(categoryId, id, size)).rejects.toEqual(
        new BadRequestException(`Sub Category with id ${id} not found to category with id ${categoryId}`)
      );
    });

    it('should update a sub category with error *Sub Category with name ${updateSubDto.name} already exists in category with id ${categoryId}*', async () => {
      // Arrange
      const categoryId = 1;
      const id = 2;
      const sub: UpdateCategoryDto = { name: 'name', active: true };

      // Act

      // Assert
      expect(service.update(categoryId, id, sub)).rejects.toEqual(
        new BadRequestException(`Sub Category with name ${sub.name} already exists in category with id ${categoryId}`)
      );
    });
  });

  describe('remove', () => {
    it('should remove a sub category', async () => {
      // Arrange
      const categoryId = 1;
      const id = 1;

      // Act
      await service.remove(categoryId, id);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ id, categoryId });
    });
  });
});
