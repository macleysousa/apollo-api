import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { authRequestFake } from 'src/base-fake/auth-request';
import { caixaFakeRepository } from 'src/base-fake/caixa';

import { CaixaService } from './caixa.service';
import { CaixaEntity } from './entities/caixa.entity';
import { CreateCaixaDto } from './dto/create-caixa.dto';

describe('CaixaService', () => {
  let service: CaixaService;
  let repository: Repository<CaixaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaixaService,
        {
          provide: 'REQUEST',
          useValue: {
            usuario: authRequestFake.usuario,
          },
        },
        {
          provide: getRepositoryToken(CaixaEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(caixaFakeRepository.caixas()),
            findOne: jest.fn().mockResolvedValue(caixaFakeRepository.caixaFechado()),
            save: jest.fn().mockResolvedValue(caixaFakeRepository.caixaAberto()),
          },
        },
      ],
    }).compile();

    service = module.get<CaixaService>(CaixaService);
    repository = module.get<Repository<CaixaEntity>>(getRepositoryToken(CaixaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('open', () => {
    it('should create the first caixa', async () => {
      const createCaixaDto: CreateCaixaDto = {
        empresaId: 1,
        terminalId: 1,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(caixaFakeRepository.caixaAberto());

      const result = await service.open(createCaixaDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId: 1, terminalId: 1 }, order: { id: 'DESC' } });
      expect(repository.save).toHaveBeenCalledWith({ empresaId: 1, valorAbertura: 0, operadorAberturaId: 1, terminalId: 1 });
      expect(service.findById).toHaveBeenCalledWith(1, 1);

      expect(result).toEqual(caixaFakeRepository.caixaAberto());
    });

    it('should create a new caixa', async () => {
      const createCaixaDto: CreateCaixaDto = {
        empresaId: 1,
        terminalId: 1,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(caixaFakeRepository.caixaFechado());
      jest.spyOn(service, 'findById').mockResolvedValueOnce(caixaFakeRepository.caixaAberto());

      const result = await service.open(createCaixaDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId: 1, terminalId: 1 }, order: { id: 'DESC' } });
      expect(repository.save).toHaveBeenCalledWith({ empresaId: 1, valorAbertura: 100, operadorAberturaId: 1, terminalId: 1 });
      expect(service.findById).toHaveBeenCalledWith(1, 1);

      expect(result).toEqual(caixaFakeRepository.caixaAberto());
    });

    it('should throw BadRequestException if caixa already open', async () => {
      const createCaixaDto: CreateCaixaDto = {
        empresaId: 1,
        terminalId: 1,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(caixaFakeRepository.caixaAberto());

      await expect(service.open(createCaixaDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return the caixa with the given id', async () => {
      const caixa = { id: 1 } as CaixaEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(caixa);

      const result = await service.findById(1, 1);

      expect(result).toEqual(caixa);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId: 1, id: 1 } });
    });

    it('should return null if caixa not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      const result = await service.findById(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId: 1, id: 1 } });
      expect(result).toBeUndefined();
    });
  });
});
