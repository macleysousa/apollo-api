import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { colorFakeRepository } from 'src/base-fake/color';

import { CorService } from './cor.service';
import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';
import { CorEntity } from './entities/cor.entity';

describe('ColorService', () => {
  let service: CorService;
  let repository: Repository<CorEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorService,
        {
          provide: getRepositoryToken(CorEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(colorFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CorService>(CorService);
    repository = module.get<Repository<CorEntity>>(getRepositoryToken(CorEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('upsert', () => {
    it('should create a color', async () => {
      //Arrange
      const colors: CreateCorDto[] = [{ nome: 'black' }, { nome: 'blue' }, { nome: 'green' }];

      // Act
      const result = await service.upsert(colors);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(colorFakeRepository.find());
    });
  });

  describe('create', () => {
    it('should create a color', async () => {
      //Arrange
      const color: CreateCorDto = { id: 1, nome: 'RED', inativa: true };

      // Act
      const result = await service.create(color);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(color);

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('find', () => {
    it('should return a color list not use filter', async () => {
      // Arrange

      // Act
      const result = await service.find();

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${''}%`), inativa: undefined },
      });

      expect(result).toEqual(colorFakeRepository.find());
    });

    it('should return a color list use filter', async () => {
      // Arrange
      const nome = 'back';
      const inativa = true;

      // Act
      const result = await service.find(nome, inativa);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${nome}%`), inativa: Boolean(inativa) },
      });

      expect(result).toEqual(colorFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should return a color', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('findByName', () => {
    it('should return a color', async () => {
      // Arrange
      const name = 'red';

      // Act
      const result = await service.findByName(name);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { nome: name } });

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('findByNames', () => {
    it('should return a color list', async () => {
      // Arrange
      const names = ['red', 'blue'];

      // Act
      const result = await service.findByNames(names);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { nome: In(names) } });

      expect(result).toEqual(colorFakeRepository.find());
    });
  });

  describe('update', () => {
    it('should update color', async () => {
      // Arrange
      const id = 1;
      const color: UpdateCorDto = { nome: 'white', inativa: false };

      // Act
      const result = await service.update(id, color);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({ ...colorFakeRepository.findOne(), ...color });

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('delete', () => {
    it('should delete color', async () => {
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
