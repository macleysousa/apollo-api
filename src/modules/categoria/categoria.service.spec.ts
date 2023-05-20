import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryFakeRepository } from 'src/base-fake/category';
import { ILike, Repository } from 'typeorm';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-category.dto';
import { UpdateCategoriaDto } from './dto/update-category.dto';
import { CategoriaEntity } from './entities/category.entity';

describe('CategoryService', () => {
  let service: CategoriaService;
  let repository: Repository<CategoriaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: getRepositoryToken(CategoriaEntity),
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

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      // Arrange
      const category: CreateCategoriaDto = { id: 1, nome: 'Name', inativa: true };
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
      const category: CreateCategoriaDto = { id: 1, nome: 'Test', inativa: true };

      // Act

      // Assert
      expect(service.create(category)).rejects.toEqual(new BadRequestException(`Category with id ${category.id} already exists`));
    });

    it('should create a new category with error *Category with name ${createCategoryDto.name} already exists*', async () => {
      // Arrange
      const category: CreateCategoriaDto = { id: 2, nome: 'Name', inativa: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.create(category)).rejects.toEqual(new BadRequestException(`Category with name ${category.nome} already exists`));
    });
  });

  describe('find', () => {
    it('should find all categories with no filter', async () => {
      // Arrange
      const nome = undefined;
      const inativa = undefined;

      // Act
      const result = await service.find(nome, inativa);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${''}%`), inativa: undefined },
      });

      expect(result).toEqual(categoryFakeRepository.find());
    });

    it('should find all categories with filter', async () => {
      // Arrange
      const nome = 'nome';
      const inativa = true;

      // Act
      const result = await service.find(nome, inativa);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${nome}%`), inativa },
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
      const nome = 'Name';

      // Act
      const result = await service.findByName(nome);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { nome } });

      expect(result).toEqual(categoryFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      // Arrange
      const id = 1;
      const size: UpdateCategoriaDto = { nome: 'Name', inativa: true };

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
      const size: UpdateCategoriaDto = { nome: 'name', inativa: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Category with id ${id} not found`));
    });

    it('should update a category with error *Category with this name ${size.name} already exists*', async () => {
      // Arrange
      const id = 2;
      const size: UpdateCategoriaDto = { nome: 'name', inativa: true };

      // Act

      // Assert
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Category with name ${size.nome} already exists`));
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
