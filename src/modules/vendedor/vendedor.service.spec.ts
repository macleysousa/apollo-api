import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { vendedorFakeRepository } from 'src/base-fake/vendedor';

import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';
import { VendedorEntity } from './entities/vendedor.entity';
import { VendedorService } from './vendedor.service';

describe('VendedorService', () => {
  let service: VendedorService;
  let repository: Repository<VendedorEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendedorService,
        {
          provide: getRepositoryToken(VendedorEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VendedorService>(VendedorService);
    repository = module.get<Repository<VendedorEntity>>(getRepositoryToken(VendedorEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vendedor', async () => {
      // Arrange
      const createVendedorDto: CreateVendedorDto = { nome: 'João', empresaId: 1 };
      const vendedorEntity: VendedorEntity = new VendedorEntity({ id: 1, nome: 'João', empresaId: 1 });

      jest.spyOn(repository, 'save').mockResolvedValueOnce(vendedorEntity);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(vendedorEntity);

      // Act
      const result = await service.create(createVendedorDto);

      // Assert
      expect(result).toEqual(vendedorEntity);
      expect(repository.save).toHaveBeenCalledWith(createVendedorDto);
      expect(service.findById).toHaveBeenCalledWith(vendedorEntity.id);
    });
  });

  describe('find', () => {
    it('should find vendedores with the given parameters', async () => {
      // Arrange
      const empresaId = 1;
      const nome = 'João';
      const inativo = true;
      const vendedores: VendedorEntity[] = vendedorFakeRepository.find();

      jest.spyOn(repository, 'find').mockResolvedValueOnce(vendedores);

      // Act
      const result = await service.find(empresaId, nome, inativo);

      // Assert
      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: Not(IsNull()) } });
      expect(result).toEqual(vendedores);
    });

    it('should find vendedores with the given parameters, even if inativo is null', async () => {
      // Arrange
      const empresaId = 1;
      const nome = 'João';
      const inativo = undefined;
      const vendedores: VendedorEntity[] = vendedorFakeRepository.find();

      jest.spyOn(repository, 'find').mockResolvedValueOnce(vendedores);

      // Act
      const result = await service.find(empresaId, nome, inativo);

      // Assert
      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: false } });
      expect(result).toEqual([vendedores[0], vendedores[1]]);
    });

    it('should find all vendedores if no parameters are given', async () => {
      // Arrange
      const empresaId = undefined;
      const nome = undefined;
      const vendedores: VendedorEntity[] = vendedorFakeRepository.find();

      jest.spyOn(repository, 'find').mockResolvedValueOnce(vendedores);

      // Act
      const result = await service.find();

      // Assert
      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: false } });
      expect(result).toEqual(vendedores);
    });
  });

  describe('findById', () => {
    it('should find a vendedor by id', async () => {
      // Arrange
      const id = 1;
      const vendedor: VendedorEntity = vendedorFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(vendedor);

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(vendedor);
    });
  });

  describe('update', () => {
    it('should update a vendedor', async () => {
      // Arrange
      const id = 1;
      const updateVendedorDto: UpdateVendedorDto = { nome: 'João' };
      const vendedorEntity: VendedorEntity = vendedorFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(vendedorEntity);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(new VendedorEntity({ id, ...updateVendedorDto }));

      // Act
      const result = await service.update(id, updateVendedorDto);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.update).toHaveBeenCalledWith(id, updateVendedorDto);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(new VendedorEntity({ empresaId: 1, id, ...updateVendedorDto, inativo: true }));
    });

    it('should throw BadRequestException if vendedor is not found', async () => {
      // Arrange
      const id = 1;
      const updateVendedorDto: UpdateVendedorDto = { nome: 'João' };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      // Act & Assert
      await expect(service.update(id, updateVendedorDto)).rejects.toThrow(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('delete', () => {
    it('should delete a vendedor', async () => {
      // Arrange
      const id = 1;
      const vendedor = vendedorFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(vendedor);
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      // Act
      const result = await service.delete(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should throw BadRequestException if vendedor is not found', async () => {
      // Arrange
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      // Act & Assert
      await expect(service.delete(id)).rejects.toThrow(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw BadRequestException if deletion fails', async () => {
      // Arrange
      const id = 1;
      const vendedorEntity: VendedorEntity = new VendedorEntity({ id, nome: 'João', empresaId: 1 });

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(vendedorEntity);
      jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(service.delete(id)).rejects.toThrow(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
