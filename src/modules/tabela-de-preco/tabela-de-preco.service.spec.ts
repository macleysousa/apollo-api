import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateTabelaDePrecoDto } from './dto/create-tabela-de-preco.dto';
import { UpdateTabelaDePrecoDto } from './dto/update-tabela-de-preco.dto';
import { TabelaDePrecoEntity } from './entities/tabela-de-preco.entity';
import { TabelaDePrecoService } from './tabela-de-preco.service';

describe('TabelaDePrecoService', () => {
  let service: TabelaDePrecoService;
  let repository: Repository<TabelaDePrecoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TabelaDePrecoService,
        {
          provide: getRepositoryToken(TabelaDePrecoEntity),
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

    service = module.get<TabelaDePrecoService>(TabelaDePrecoService);
    repository = module.get<Repository<TabelaDePrecoEntity>>(getRepositoryToken(TabelaDePrecoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a tabela de preco', async () => {
      const createTabelaDePrecoDto: CreateTabelaDePrecoDto = { nome: 'Tabela 1', inativa: false };
      const tabelaDePrecoEntity: TabelaDePrecoEntity = { id: 1, ...createTabelaDePrecoDto } as any;

      jest.spyOn(repository, 'save').mockResolvedValueOnce(tabelaDePrecoEntity);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(tabelaDePrecoEntity);

      const result = await service.create(createTabelaDePrecoDto);

      expect(result).toEqual(tabelaDePrecoEntity);
      expect(repository.save).toHaveBeenCalledWith(createTabelaDePrecoDto);
      expect(service.findById).toHaveBeenCalledWith(tabelaDePrecoEntity.id);
    });
  });

  describe('find', () => {
    it('should find all tabelas de preco', async () => {
      const tabelaDePrecoEntity: TabelaDePrecoEntity = { id: 1, nome: 'Tabela 1', inativa: false } as any;

      jest.spyOn(repository, 'find').mockResolvedValueOnce([tabelaDePrecoEntity]);

      const result = await service.find();

      expect(result).toEqual([tabelaDePrecoEntity]);
      expect(repository.find).toHaveBeenCalledWith({ where: { nome: ILike(`%%`), inativa: undefined } });
    });

    it('should find tabelas de preco by nome', async () => {
      const tabelaDePrecoEntity: TabelaDePrecoEntity = { id: 1, nome: 'Tabela 1', inativa: false } as any;

      jest.spyOn(repository, 'find').mockResolvedValueOnce([tabelaDePrecoEntity]);

      const result = await service.find('Tabela');

      expect(result).toEqual([tabelaDePrecoEntity]);
      expect(repository.find).toHaveBeenCalledWith({ where: { nome: ILike(`%Tabela%`), inativa: undefined } });
    });

    it('should find tabelas de preco by inativa', async () => {
      const tabelaDePrecoEntity: TabelaDePrecoEntity = { id: 1, nome: 'Tabela 1', inativa: true } as any;

      jest.spyOn(repository, 'find').mockResolvedValueOnce([tabelaDePrecoEntity]);

      const result = await service.find(undefined, true);

      expect(result).toEqual([tabelaDePrecoEntity]);
      expect(repository.find).toHaveBeenCalledWith({ where: { nome: ILike(`%%`), inativa: true } });
    });
  });

  describe('findById', () => {
    it('should find a tabela de preco by id', async () => {
      const tabelaDePrecoEntity: TabelaDePrecoEntity = { id: 1, nome: 'Tabela 1', inativa: false } as any;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(tabelaDePrecoEntity);

      const result = await service.findById(1);

      expect(result).toEqual(tabelaDePrecoEntity);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a tabela de preco', async () => {
      const updateTabelaDePrecoDto: UpdateTabelaDePrecoDto = { nome: 'Tabela 2', inativa: true };
      const tabelaDePrecoEntity: TabelaDePrecoEntity = { id: 1, nome: 'Tabela 1', inativa: false } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(tabelaDePrecoEntity).mockResolvedValueOnce(tabelaDePrecoEntity);

      const result = await service.update(1, updateTabelaDePrecoDto);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, updateTabelaDePrecoDto);
      expect(result).toEqual(tabelaDePrecoEntity);
    });

    it('should throw BadRequestException if tabela de preco does not exist', async () => {
      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a tabela de preco', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if tabela de preco does not exist', async () => {
      const error = new Error('Tabela de preco not found');
      jest.spyOn(repository, 'delete').mockRejectedValueOnce(error);

      await expect(service.delete(1)).rejects.toThrow(BadRequestException);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
