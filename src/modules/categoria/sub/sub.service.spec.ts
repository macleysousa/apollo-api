import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { categoryFakeRepository } from 'src/base-fake/category';

import { UpdateCategoriaDto } from '../dto/update-category.dto';
import { CreateSubCategoriaDto } from './dto/create-sub.dto';
import { UpdateSubCategoriaDto } from './dto/update-sub.dto';
import { SubCategoriaEntity } from './entities/sub.entity';
import { SubCategoriaService } from './sub.service';

describe('SubService', () => {
  let service: SubCategoriaService;
  let repository: Repository<SubCategoriaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoriaService,
        {
          provide: getRepositoryToken(SubCategoriaEntity),
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

    service = module.get<SubCategoriaService>(SubCategoriaService);
    repository = module.get<Repository<SubCategoriaEntity>>(getRepositoryToken(SubCategoriaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert a sub category', async () => {
      // Arrange
      const subs: CreateSubCategoriaDto[] = [
        { categoriaId: 1, nome: 'Name' },
        { categoriaId: 1, nome: 'Name 2' },
      ];

      // Act
      const result = await service.upsert(subs);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(categoryFakeRepository.findSub());
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      // Arrange
      const categoriaId = 1;
      const sub: CreateSubCategoriaDto = { nome: 'Name', inativa: true };
      jest.spyOn(service, 'findByName').mockResolvedValue(undefined);

      // Act
      const result = await service.create(categoriaId, sub);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({ categoriaId, ...sub });

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });

    it('should create a new category with error *Category with name ${createCategoryDto.name} already exists*', async () => {
      // Arrange
      const categoriaId = 1;
      const sub: CreateSubCategoriaDto = { nome: 'Name', inativa: true };

      // Act

      // Assert
      expect(service.create(categoriaId, sub)).rejects.toEqual(
        new BadRequestException(`Sub Category with name ${sub.nome} already exists`)
      );
    });
  });

  describe('find', () => {
    it('should find all subs categories with no filter', async () => {
      // Arrange
      const categoriaId = 1;
      const nome = undefined;
      const intiva = undefined;

      // Act
      const result = await service.find(categoriaId, nome, intiva);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { categoriaId, nome: ILike(`%${''}%`), intiva: undefined },
      });

      expect(result).toEqual(categoryFakeRepository.findSub());
    });

    it('should find all sub categories with filter', async () => {
      // Arrange
      const categoriaId = 1;
      const nome = 'nome';
      const inativa = true;

      // Act
      const result = await service.find(categoriaId, nome, inativa);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { categoriaId, nome: ILike(`%${nome}%`), inativa },
      });

      expect(result).toEqual(categoryFakeRepository.findSub());
    });
  });

  describe('findById', () => {
    it('should find a sub category by categoriaId and id', async () => {
      // Arrange
      const categoriaId = 1;
      const id = 1;

      // Act
      const result = await service.findById(categoriaId, id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id, categoriaId } });

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });
  });

  describe('findByName', () => {
    it('should find a sub category by categoriaId and name', async () => {
      // Arrange
      const categoriaId = 1;
      const nome = 'Name';

      // Act
      const result = await service.findByName(categoriaId, nome);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { categoriaId, nome } });

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });
  });

  describe('findByNames', () => {
    it('should find a sub category by categoriaId and names', async () => {
      // Arrange
      const categoriaId = 1;
      const names = ['Name'];

      // Act
      const result = await service.findByNames(categoriaId, names);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { categoriaId, nome: In(names) } });

      expect(result).toEqual(categoryFakeRepository.findSub());
    });
  });

  describe('update', () => {
    it('should update a sub category', async () => {
      // Arrange
      const categoriaId = 1;
      const id = 1;
      const size: UpdateCategoriaDto = { nome: 'Name', inativa: true };

      // Act
      const result = await service.update(categoriaId, id, size);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, size);

      expect(result).toEqual(categoryFakeRepository.findSubOne());
    });

    it('should update a sub category with error *Sub Category with id ${id} not found to category with id ${categoriaId}*', async () => {
      // Arrange
      const categoriaId = 1;
      const id = 1;
      const size: UpdateSubCategoriaDto = { nome: 'name', inativa: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(categoriaId, id, size)).rejects.toEqual(
        new BadRequestException(`Sub Category with id ${id} not found to category with id ${categoriaId}`)
      );
    });

    it('should update a sub category with error *Sub Category with name ${updateSubDto.name} already exists in category with id ${categoriaId}*', async () => {
      // Arrange
      const categoriaId = 1;
      const id = 2;
      const sub: UpdateCategoriaDto = { nome: 'name', inativa: true };

      // Act

      // Assert
      expect(service.update(categoriaId, id, sub)).rejects.toEqual(
        new BadRequestException(`Sub Category with name ${sub.nome} already exists in category with id ${categoriaId}`)
      );
    });
  });

  describe('remove', () => {
    it('should remove a sub category', async () => {
      // Arrange
      const categoriaId = 1;
      const id = 1;

      // Act
      await service.remove(categoriaId, id);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ id, categoriaId });
    });
  });
});
