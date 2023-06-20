import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { pessoaEnderecoFakeRepository } from 'src/base-fake/pessoa-endereco';

import { PessoaEnderecoService } from './pessoa-endereco.service';
import { PessoaEnderecoEntity } from './entities/pessoa-endereco.entity';
import { CreatePessoaEnderecoDto } from './dto/create-pessoa-endereco.dto';
import { UpdatePessoaEnderecoDto } from './dto/update-pessoa-endereco.dto';
import { EnderecoTipo } from './enum/endereco-tipo.enum';

describe('PessoaEnderecoService', () => {
  let service: PessoaEnderecoService;
  let repository: Repository<PessoaEnderecoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaEnderecoService,
        {
          provide: getRepositoryToken(PessoaEnderecoEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(pessoaEnderecoFakeRepository.findOne()),
            save: jest.fn().mockResolvedValue(pessoaEnderecoFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<PessoaEnderecoService>(PessoaEnderecoService);
    repository = module.get<Repository<PessoaEnderecoEntity>>(getRepositoryToken(PessoaEnderecoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new PessoaEnderecoEntity and return it', async () => {
      // Arrange
      const pessoaId = 1;
      const createPessoaEnderecoDto: CreatePessoaEnderecoDto = { tipoEndereco: EnderecoTipo.Comercial };
      const pessoaEndereco = pessoaEnderecoFakeRepository.findOne();
      pessoaEndereco.pessoaId = pessoaId;

      jest.spyOn(repository, 'save').mockResolvedValueOnce(pessoaEndereco);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoaEndereco);

      // Act
      const result = await service.create(pessoaId, createPessoaEnderecoDto);

      // Assert
      expect(repository.save).toHaveBeenCalledWith({ ...createPessoaEnderecoDto, pessoaId });
      expect(service.findById).toHaveBeenCalledWith(pessoaEndereco.pessoaId);
      expect(result).toEqual(pessoaEndereco);
    });
  });

  describe('findById', () => {
    it('should find and return a PessoaEnderecoEntity by pessoaId', async () => {
      // Arrange
      const pessoaId = 1;
      const pessoaEndereco = pessoaEnderecoFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pessoaEndereco);

      // Act
      const result = await service.findById(pessoaId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { pessoaId } });
      expect(result).toEqual(pessoaEndereco);
    });

    it('should throw a BadRequestException if no PessoaEnderecoEntity is found', async () => {
      // Arrange
      const pessoaId = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findById(pessoaId)).rejects.toThrowError(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { pessoaId } });
    });
  });

  describe('update', () => {
    it('should update and return a PessoaEnderecoEntity by pessoaId', async () => {
      // Arrange
      const pessoaId = 1;
      const updatePessoaEnderecoDto: UpdatePessoaEnderecoDto = { tipoEndereco: EnderecoTipo.Comercial };
      const pessoaEndereco = pessoaEnderecoFakeRepository.findOne();

      // Act
      const result = await service.update(pessoaId, updatePessoaEnderecoDto);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { pessoaId } });
      expect(repository.update).toHaveBeenCalledWith({ pessoaId }, updatePessoaEnderecoDto);

      expect(result).toEqual(pessoaEndereco);
    });

    it('should throw a BadRequestException if no PessoaEnderecoEntity is found', async () => {
      // Arrange
      const pessoaId = 1;
      const updatePessoaEnderecoDto: UpdatePessoaEnderecoDto = { tipoEndereco: EnderecoTipo.Comercial };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.update(pessoaId, updatePessoaEnderecoDto)).rejects.toThrowError(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { pessoaId } });
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a PessoaEnderecoEntity by pessoaId', async () => {
      // Arrange
      const pessoaId = 1;
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      // Act
      await service.delete(pessoaId);

      // Assert
      expect(repository.delete).toHaveBeenCalledWith({ pessoaId });
    });
  });
});
