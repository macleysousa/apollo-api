import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { caixaFakeRepository } from 'src/base-fake/caixa';
import { ContextService } from 'src/context/context.service';

import { CaixaService } from './caixa.service';
import { CreateCaixaDto } from './dto/create-caixa.dto';
import { CaixaEntity } from './entities/caixa.entity';

describe('CaixaService', () => {
  let service: CaixaService;
  let repository: Repository<CaixaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaixaService,
        {
          provide: getRepositoryToken(CaixaEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(caixaFakeRepository.caixas()),
            findOne: jest.fn().mockResolvedValue(caixaFakeRepository.caixaFechado()),
            save: jest.fn().mockResolvedValue(caixaFakeRepository.caixaAberto()),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue({ id: 1 }),
            currentBranch: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-18') }),
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
      const data = new Date('2023-06-18');
      const operadorAberturaId = 1;
      const valorAbertura = 0;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(caixaFakeRepository.caixaAberto());

      const result = await service.open(createCaixaDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId: 1, terminalId: 1 }, order: { id: 'DESC' } });
      expect(repository.save).toHaveBeenCalledWith({ empresaId: 1, data, valorAbertura, operadorAberturaId, terminalId: 1 });
      expect(service.findById).toHaveBeenCalledWith(1, 1);

      expect(result).toEqual(caixaFakeRepository.caixaAberto());
    });

    it('should create a new caixa', async () => {
      const createCaixaDto: CreateCaixaDto = {
        empresaId: 1,
        terminalId: 1,
      };
      const data = new Date('2023-06-18');
      const operadorAberturaId = 1;
      const valorAbertura = 100;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(caixaFakeRepository.caixaFechado());
      jest.spyOn(service, 'findById').mockResolvedValueOnce(caixaFakeRepository.caixaAberto());

      const result = await service.open(createCaixaDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId: 1, terminalId: 1 }, order: { id: 'DESC' } });
      expect(repository.save).toHaveBeenCalledWith({ empresaId: 1, data, valorAbertura, operadorAberturaId, terminalId: 1 });
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
