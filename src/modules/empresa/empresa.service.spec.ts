import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { empresaFakeRepository } from 'src/base-fake/empresa';

import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EmpresaService } from './empresa.service';
import { EmpresaEntity } from './entities/empresa.entity';

describe('BranchService', () => {
  let service: EmpresaService;
  let repository: Repository<EmpresaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaService,
        {
          provide: getRepositoryToken(EmpresaEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(empresaFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(empresaFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(empresaFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(empresaFakeRepository.findOne()),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmpresaService>(EmpresaService);
    repository = module.get<Repository<EmpresaEntity>>(getRepositoryToken(EmpresaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a branch', async () => {
      // Arrange
      const branch: CreateEmpresaDto = { id: 1, cnpj: '01.248.473/0001-75', nome: 'branch1', nomeFantasia: 'fantasyName' };

      // Act
      const result = await service.create(branch);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);

      expect(result).toEqual(empresaFakeRepository.findOne());
    });
  });

  describe('find', () => {
    it('should find branches no use filter', async () => {
      // Arrange
      const filter = '';
      const relations = undefined;

      // Act
      const result = await service.find();

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          cnpj: ILike(`%${filter ?? ''}%`),
          nome: ILike(`%${filter ?? ''}%`),
        },
        relations,
      });

      expect(result).toEqual(empresaFakeRepository.find());
    });

    it('should find branches with filter', async () => {
      // Arrange
      const filter = 'filter';
      const relations = ['parametros'] as any;

      // Act
      const result = await service.find(filter, relations);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          cnpj: ILike(`%${filter ?? ''}%`),
          nome: ILike(`%${filter ?? ''}%`),
        },
        relations,
      });

      expect(result).toEqual(empresaFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should find a branch by id', async () => {
      // Arrange
      const id = 1;
      const relations = ['parametros'] as any;

      // Act
      const result = await service.findById(id, relations);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, relations });

      expect(result).toEqual(empresaFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a branch', async () => {
      // Arrange
      const id = 1;
      const branch: UpdateEmpresaDto = { cnpj: '01.248.473/0001-75', nome: 'branch1', nomeFantasia: 'fantasyName' };

      // Act
      const result = await service.update(id, branch);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, branch);

      expect(result).toEqual(empresaFakeRepository.findOne());
    });
  });

  describe('remove', () => {
    it('should remove a branch', async () => {
      // Arrange
      const id = 1;

      // Act
      await service.remove(id);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
