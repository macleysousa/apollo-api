import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { sizeFakeRepository } from 'src/base-fake/size';

import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { TamanhoEntity } from './entities/tamanho.entity';
import { TamanhoService } from './tamanho.service';
import { TamanhoFilter } from './filters/tamanho.filter';

describe('SizeService', () => {
  let service: TamanhoService;
  let repository: Repository<TamanhoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TamanhoService,
        {
          provide: getRepositoryToken(TamanhoEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(sizeFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
            save: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TamanhoService>(TamanhoService);
    repository = module.get<Repository<TamanhoEntity>>(getRepositoryToken(TamanhoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert a size', async () => {
      // Arrange
      const size: CreateTamanhoDto[] = [{ nome: 'P' }, { nome: 'M' }];

      // Act
      const result = await service.upsert(size);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sizeFakeRepository.find());
    });
  });

  describe('create', () => {
    it('should create a new size', async () => {
      // Arrange
      const size: CreateTamanhoDto = { id: 1, nome: 'P', inativo: true };

      // Act
      const result = await service.create(size);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(size);

      expect(result).toEqual(sizeFakeRepository.findOne());
    });

    it('should create a new size with error *Size with this id ${size.id} already exists*', async () => {
      // Arrange
      const size: CreateTamanhoDto = { id: 1, nome: 'M', inativo: true };

      // Act

      // Assert
      expect(service.create(size)).rejects.toEqual(new BadRequestException(`Size with this id ${size.id} already exists`));
    });

    it('should create a new size with error *Size with this id ${size.nome} already exists*', async () => {
      // Arrange
      const size: CreateTamanhoDto = { id: 2, nome: 'M', inativo: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.create(size)).rejects.toEqual(new BadRequestException(`Size with this name ${size.nome} already exists`));
    });
  });

  describe('find', () => {
    it('should find all size with no filter', async () => {
      // Arrange
      const filter: TamanhoFilter = undefined;

      // Act
      const result = await service.find(filter);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: undefined, inativo: undefined },
        cache: true,
      });

      expect(result).toEqual(sizeFakeRepository.find());
    });

    it('should find all size with filter', async () => {
      // Arrange

      const filter: TamanhoFilter = { nome: 'M', inativo: true, cache: false };

      // Act
      const result = await service.find(filter);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${filter.nome}%`), inativo: filter.inativo },
        cache: filter.cache,
      });

      expect(result).toEqual(sizeFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should find a size by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(sizeFakeRepository.findOne());
    });
  });

  describe('findBynome', () => {
    it('should find a size by nome', async () => {
      // Arrange
      const nome = 'M';

      // Act
      const result = await service.findByName(nome);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { nome } });

      expect(result).toEqual(sizeFakeRepository.findOne());
    });
  });

  describe('findByNames', () => {
    it('should find a size by names', async () => {
      // Arrange
      const names = ['P', 'M'];

      // Act
      const result = await service.findByNames(names);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { nome: In(names) } });

      expect(result).toEqual(sizeFakeRepository.find());
    });
  });

  describe('update', () => {
    it('should update a size', async () => {
      // Arrange
      const id = 1;
      const size: CreateTamanhoDto = { id: 1, nome: 'P', inativo: true };

      // Act
      const result = await service.update(id, size);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, size);

      expect(result).toEqual(sizeFakeRepository.findOne());
    });

    it('should update a size with error *Size with this id ${size.id} does not exist*', async () => {
      // Arrange
      const id = 1;
      const size: UpdateTamanhoDto = { nome: 'M', inativo: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Tamanho com id ${id} não encontrado`));
    });

    it('should update a size with error *Size with this nome ${size.nome} already exists*', async () => {
      // Arrange
      const id = 2;
      const size: UpdateTamanhoDto = { nome: 'M', inativo: true };

      // Act

      // Assert
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Tamanho com nome ${size.nome} já existe`));
    });
  });

  describe('remove', () => {
    it('should remove a size', async () => {
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
