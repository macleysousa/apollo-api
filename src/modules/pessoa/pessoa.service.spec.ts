import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';

import { pessoaFakeRepository } from 'src/base-fake/pessoa';

import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoaTipo } from './enum/pessoa-tipo.enum';
import { PessoaService } from './pessoa.service';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(pessoaFakeRepository.findPaginate()),
}));

describe('PessoaService', () => {
  let service: PessoaService;
  let repository: Repository<PessoaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaService,
        {
          provide: getRepositoryToken(PessoaEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(pessoaFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            save: jest.fn().mockResolvedValue(pessoaFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              cache: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockReturnThis(),
              clone: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PessoaService>(PessoaService);
    repository = module.get<Repository<PessoaEntity>>(getRepositoryToken(PessoaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pessoa', async () => {
      // Arrange
      const empresaId = 1;
      const createPessoaDto: CreatePessoaDto = {
        nome: 'John Doe',
        documento: '123456789',
        tipo: PessoaTipo.Física,
      };
      const pessoa = pessoaFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(pessoa);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoa);

      // Act
      const result = await service.create(empresaId, createPessoaDto);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({ where: { documento: createPessoaDto.documento } });
      expect(repository.save).toHaveBeenCalledWith({
        ...createPessoaDto,
        empresaCadastro: empresaId,
        empresasAcesso: [empresaId],
      });
      expect(service.findById).toHaveBeenCalledWith(pessoa.id);
      expect(result).toEqual(pessoa);
    });

    it('should throw BadRequestException if pessoa with same documento already exists', async () => {
      // Arrange
      const empresaId = 1;
      const createPessoaDto: CreatePessoaDto = {
        nome: 'John Doe',
        documento: '123456789',
        tipo: PessoaTipo.Física,
      };
      const pessoa = pessoaFakeRepository.findOne();

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pessoa);

      // Act
      const promise = service.create(empresaId, createPessoaDto);

      // Assert
      await expect(promise).rejects.toThrow(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { documento: createPessoaDto.documento } });
    });
  });

  describe('find', () => {
    it('should filter by searchTerm', async () => {
      // Arrange
      const filter = {
        searchTerm: 'John',
      };

      // Act
      const result = await service.find(filter);

      // Assert
      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('p');

      expect(repository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith({ id: Not(IsNull()) });

      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledTimes(3);
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ id: ILike(`%${filter.searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ nome: ILike(`%${filter.searchTerm}%`) });
      expect(repository.createQueryBuilder().orWhere).toHaveBeenCalledWith({ documento: ILike(`%${filter.searchTerm}%`) });

      expect(result).toEqual(pessoaFakeRepository.findPaginate());
    });
  });

  describe('findById', () => {
    it('should return a PessoaEntity', async () => {
      const id = 1;
      const pessoa = new PessoaEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pessoa);

      const result = await service.findById(id);

      expect(result).toEqual(pessoa);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return null if no PessoaEntity is found', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findById(id);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('findByDocumento', () => {
    it('should return a PessoaEntity', async () => {
      const documento = '123456789';
      const pessoa = new PessoaEntity();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pessoa);

      const result = await service.findByDocumento(documento);

      expect(result).toEqual(pessoa);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { documento } });
    });

    it('should return null if no PessoaEntity is found', async () => {
      const documento = '123456789';
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findByDocumento(documento);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { documento } });
    });
  });

  describe('update', () => {
    it('should update a PessoaEntity and return it', async () => {
      const id = 1;
      const updatePessoaDto: UpdatePessoaDto = { nome: 'John Doe' };
      const pessoa = new PessoaEntity();
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoa);

      const result = await service.update(id, updatePessoaDto);

      expect(repository.update).toHaveBeenCalledWith(id, updatePessoaDto);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(pessoa);
    });
  });

  describe('block', () => {
    it('should block a PessoaEntity and return it', async () => {
      const id = 1;
      const pessoa = pessoaFakeRepository.findOne();
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoa);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      const result = await service.block(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.update).toHaveBeenCalledWith(id, { bloqueado: true });
      expect(result).toEqual(pessoa);
    });

    it('should throw a BadRequestException if no PessoaEntity is found', async () => {
      const id = 1;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      await expect(service.block(id)).rejects.toThrowError(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('unblock', () => {
    it('should unblock a PessoaEntity and return it', async () => {
      const id = 1;
      const pessoa = pessoaFakeRepository.findOne();
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoa);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      const result = await service.unblock(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.update).toHaveBeenCalledWith(id, { bloqueado: false });
      expect(result).toEqual(pessoa);
    });

    it('should throw a BadRequestException if no PessoaEntity is found', async () => {
      const id = 1;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      await expect(service.unblock(id)).rejects.toThrowError(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('liberarAcesso', () => {
    it('should grant access to a company and return the updated PessoaEntity', async () => {
      const id = 1;
      const empresaId = 2;
      const pessoa = pessoaFakeRepository.findOne();
      pessoa.empresasAcesso.push(empresaId);

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoa).mockResolvedValueOnce(pessoa);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      const result = await service.liberarAcesso(id, empresaId);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.save).toHaveBeenCalledWith(pessoa);
      expect(result).toEqual(pessoa);
      expect(pessoa.empresasAcesso).toContain(empresaId);
    });

    it('should not grant access to a company if already granted and return the PessoaEntity', async () => {
      const id = 1;
      const empresaId = 3;
      const pessoa = pessoaFakeRepository.findOne();
      pessoa.empresasAcesso.push(empresaId);

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pessoaFakeRepository.findOne()).mockResolvedValueOnce(pessoa);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      const result = await service.liberarAcesso(id, empresaId);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.save).toHaveBeenCalledWith(pessoa);
      expect(result).toEqual(pessoa);
      expect(result.empresasAcesso).toContain(empresaId);
    });

    it('should throw a BadRequestException if no PessoaEntity is found', async () => {
      const id = 1;
      const empresaId = 3;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.liberarAcesso(id, empresaId)).rejects.toThrowError(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
