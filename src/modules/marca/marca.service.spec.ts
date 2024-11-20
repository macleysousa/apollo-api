import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { brandFakeRepository } from 'src/base-fake/brand';

import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaEntity } from './entities/marca.entity';
import { MarcaService } from './marca.service';

describe('BrandService', () => {
  let service: MarcaService;
  let repository: Repository<MarcaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcaService,
        {
          provide: getRepositoryToken(MarcaEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(brandFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(brandFakeRepository.findOne()),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MarcaService>(MarcaService);
    repository = module.get<Repository<MarcaEntity>>(getRepositoryToken(MarcaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new brand', async () => {
      // Arrange
      const category: CreateMarcaDto = { nome: 'Name', inativa: true };
      jest.spyOn(service, 'findByName').mockResolvedValue(undefined);

      // Act
      const result = await service.create(category);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(category);

      expect(result).toEqual(brandFakeRepository.findOne());
    });

    it('should create a new brand with error *Brand with name ${brand.name} already exists*', async () => {
      // Arrange
      const brand: CreateMarcaDto = { nome: 'Name', inativa: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.create(brand)).rejects.toEqual(new BadRequestException(`Brand with name ${brand.nome} already exists`));
    });
  });

  describe('find', () => {
    it('should find all brands with no filter', async () => {
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

      expect(result).toEqual(brandFakeRepository.find());
    });

    it('should find all brands with filter', async () => {
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

      expect(result).toEqual(brandFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should find a brand by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(brandFakeRepository.findOne());
    });
  });

  describe('findByName', () => {
    it('should find a brand by name', async () => {
      // Arrange
      const nome = 'Name';

      // Act
      const result = await service.findByName(nome);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { nome } });

      expect(result).toEqual(brandFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a brand', async () => {
      // Arrange
      const id = 1;
      const brand: UpdateMarcaDto = { nome: 'Name', inativa: true };

      // Act
      const result = await service.update(id, brand);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, brand);

      expect(result).toEqual(brandFakeRepository.findOne());
    });

    it('should update a brand with error *Brand with id ${id} not found*', async () => {
      // Arrange
      const id = 1;
      const brand: UpdateMarcaDto = { nome: 'name', inativa: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(id, brand)).rejects.toEqual(new BadRequestException(`Brand with id ${id} not found`));
    });

    it('should update a brand with error *Brand with this name ${brand.name} already exists*', async () => {
      // Arrange
      const id = 2;
      const brand: UpdateMarcaDto = { nome: 'name', inativa: true };

      // Act

      // Assert
      expect(service.update(id, brand)).rejects.toEqual(new BadRequestException(`Brand with name ${brand.nome} already exists`));
    });
  });

  describe('remove', () => {
    it('should remove a brand', async () => {
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
