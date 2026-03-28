import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { funcionarioFakeRepository } from 'src/base-fake/funcionario';

import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { FuncionarioEntity } from './entities/funcionario.entity';
import { FuncionarioService } from './funcionario.service';

describe('FuncionarioService', () => {
  let service: FuncionarioService;
  let repository: Repository<FuncionarioEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuncionarioService,
        {
          provide: getRepositoryToken(FuncionarioEntity),
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

    service = module.get<FuncionarioService>(FuncionarioService);
    repository = module.get<Repository<FuncionarioEntity>>(getRepositoryToken(FuncionarioEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new funcionario', async () => {
      // Arrange
      const createFuncionarioDto: CreateFuncionarioDto = { nome: 'João', empresaId: 1 };
      const funcionarioEntity: FuncionarioEntity = new FuncionarioEntity({ id: 1, nome: 'João', empresaId: 1 });

      jest.spyOn(repository, 'save').mockResolvedValueOnce(funcionarioEntity);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(funcionarioEntity);

      // Act
      const result = await service.create(createFuncionarioDto);

      // Assert
      expect(result).toEqual(funcionarioEntity);
      expect(repository.save).toHaveBeenCalledWith(createFuncionarioDto);
      expect(service.findById).toHaveBeenCalledWith(funcionarioEntity.id);
    });
  });

  describe('find', () => {
    it('should find funcionarios with the given parameters', async () => {
      // Arrange
      const empresaId = 1;
      const nome = 'João';
      const inativo = true;
      const funcionarios: FuncionarioEntity[] = funcionarioFakeRepository.find();

      jest.spyOn(repository, 'find').mockResolvedValueOnce(funcionarios);

      // Act
      const result = await service.find(empresaId, nome, inativo);

      // Assert
      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: Not(IsNull()) } });
      expect(result).toEqual(funcionarios);
    });

    it('should find funcionarios with the given parameters, even if inativo is null', async () => {
      // Arrange
      const empresaId = 1;
      const nome = 'João';
      const inativo = undefined;
      const funcionarios: FuncionarioEntity[] = funcionarioFakeRepository.find();

      jest.spyOn(repository, 'find').mockResolvedValueOnce(funcionarios);

      // Act
      const result = await service.find(empresaId, nome, inativo);

      // Assert
      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: false } });
      expect(result).toEqual([funcionarios[0], funcionarios[1]]);
    });

    it('should find all funcionarios if no parameters are given', async () => {
      // Arrange
      const empresaId = undefined;
      const nome = undefined;
      const funcionarios: FuncionarioEntity[] = funcionarioFakeRepository.find();

      jest.spyOn(repository, 'find').mockResolvedValueOnce(funcionarios);

      // Act
      const result = await service.find();

      // Assert
      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, nome: ILike(`%${nome}%`), inativo: false } });
      expect(result).toEqual(funcionarios);
    });
  });

  describe('findById', () => {
    it('should find a funcionario by id', async () => {
      // Arrange
      const id = 1;
      const funcionario: FuncionarioEntity = funcionarioFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(funcionario);

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(funcionario);
    });
  });

  describe('update', () => {
    it('should update a funcionario', async () => {
      // Arrange
      const id = 1;
      const updateFuncionarioDto: UpdateFuncionarioDto = { nome: 'João' };
      const funcionarioEntity: FuncionarioEntity = funcionarioFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(funcionarioEntity);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(new FuncionarioEntity({ id, ...updateFuncionarioDto }));

      // Act
      const result = await service.update(id, updateFuncionarioDto);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.update).toHaveBeenCalledWith(id, updateFuncionarioDto);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(new FuncionarioEntity({ empresaId: 1, id, ...updateFuncionarioDto, inativo: true }));
    });

    it('should throw BadRequestException if funcionario is not found', async () => {
      // Arrange
      const id = 1;
      const updateFuncionarioDto: UpdateFuncionarioDto = { nome: 'João' };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      // Act & Assert
      await expect(service.update(id, updateFuncionarioDto)).rejects.toThrow(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('delete', () => {
    it('should delete a funcionario', async () => {
      // Arrange
      const id = 1;
      const funcionario = funcionarioFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(funcionario);
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      // Act
      const result = await service.delete(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should throw BadRequestException if funcionario is not found', async () => {
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
      const funcionarioEntity: FuncionarioEntity = new FuncionarioEntity({ id, nome: 'João', empresaId: 1 });

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(funcionarioEntity);
      jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(service.delete(id)).rejects.toThrow(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
