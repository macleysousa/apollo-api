import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { referenceFakeRepository } from 'src/base-fake/reference';
import { ILike, Repository } from 'typeorm';

import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { ReferenciaEntity } from './entities/referencia.entity';
import { ReferenciaService } from './referencia.service';

describe('ReferenceService', () => {
  let service: ReferenciaService;
  let repository: Repository<ReferenciaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenciaService,
        {
          provide: getRepositoryToken(ReferenciaEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
            findOne: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(referenceFakeRepository.find()),
            update: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReferenciaService>(ReferenciaService);
    repository = module.get<Repository<ReferenciaEntity>>(getRepositoryToken(ReferenciaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a reference', async () => {
      // Arrange
      const reference: CreateReferenciaDto = { id: 1, nome: 'reference', idExterno: '0001' };

      // Act
      const result = await service.create(reference);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(reference);

      expect(result).toEqual(referenceFakeRepository.findOne());
    });
  });

  describe('find', () => {
    it('should find a reference no filter', async () => {
      // Arrange

      // Act
      const result = await service.find();

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${''}%`), idExterno: ILike(`%${''}%`) },
      });

      expect(result).toEqual(referenceFakeRepository.find());
    });

    it('should find a reference with filter', async () => {
      // Arrange
      const nome = 'reference';
      const idExterno = '0001';

      // Act
      const result = await service.find(nome, idExterno);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nome: ILike(`%${nome}%`), idExterno: ILike(`%${idExterno}%`) },
      });

      expect(result).toEqual(referenceFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should find a reference by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(referenceFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a reference', async () => {
      // Arrange
      const id = 1;
      const reference: UpdateReferenciaDto = { nome: 'reference 2', idExterno: '0002' };

      // Act
      const result = await service.update(id, reference);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({ ...referenceFakeRepository.findOne(), ...reference });

      expect(result).toEqual(referenceFakeRepository.findOne());
    });

    it('should update a reference with error *Reference not found*', async () => {
      // Arrange
      const id = 1;
      const reference: UpdateReferenciaDto = { nome: 'reference 2', idExterno: '0002' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(id, reference)).rejects.toEqual(new BadRequestException('Reference not found'));
    });
  });

  describe('remove', () => {
    it('should remove a reference', async () => {
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
