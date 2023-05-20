import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { sizeFakeRepository } from 'src/base-fake/size';
import { ILike, Repository } from 'typeorm';
import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { TamanhoEntity } from './entities/tamanho.entity';
import { TamanhoService } from './tamanho.service';

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
      const nome = undefined;
      const active = undefined;

      // Act
      const result = await service.find(nome, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${''}%`), active: undefined },
      });

      expect(result).toEqual(sizeFakeRepository.find());
    });

    it('should find all size with filter', async () => {
      // Arrange
      const nome = 'M';
      const inativo = true;

      // Act
      const result = await service.find(nome, inativo);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${nome}%`), inativo },
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
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Size with this id ${id} does not exist`));
    });

    it('should update a size with error *Size with this nome ${size.nome} already exists*', async () => {
      // Arrange
      const id = 2;
      const size: UpdateTamanhoDto = { nome: 'M', inativo: true };

      // Act

      // Assert
      expect(service.update(id, size)).rejects.toEqual(new BadRequestException(`Size with this name ${size.nome} already exists`));
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
