import { Test, TestingModule } from '@nestjs/testing';

import { faturaFakeRepository } from 'src/base-fake/fatura';

import { EmpresaService } from '../empresa/empresa.service';
import { CreateFaturaManualDto } from './dto/create-fatura-manual.dto';
import { UpdateFaturaManualDto } from './dto/update-fatura-manual.dto';
import { FaturaSituacao } from './enum/fatura-situacao.enum';
import { FaturaController } from './fatura.controller';
import { FaturaService } from './fatura.service';

describe('FaturaController', () => {
  let controller: FaturaController;
  let service: FaturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaturaController],
      providers: [
        {
          provide: FaturaService,
          useValue: {
            createManual: jest.fn().mockResolvedValue(faturaFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(faturaFakeRepository.findPaginate()),
            findById: jest.fn().mockResolvedValue(faturaFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(faturaFakeRepository.findOne()),
            cancelar: jest.fn().mockResolvedValue(faturaFakeRepository.findOne()),
          },
        },
        {
          provide: EmpresaService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<FaturaController>(FaturaController);
    service = module.get<FaturaService>(FaturaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new fatura', async () => {
      const createFaturaDto: CreateFaturaManualDto = { pessoaId: 1, parcelas: 1, valor: 100, observacao: 'Observação' };
      const fatura = faturaFakeRepository.findOne();

      jest.spyOn(service, 'createManual').mockResolvedValue(fatura);

      expect(await controller.create(createFaturaDto)).toBe(fatura);
      expect(service.createManual).toHaveBeenCalledWith(createFaturaDto);
    });
  });

  describe('find', () => {
    it('should find faturas', async () => {
      const empresaIds = [1, 2, 3];
      const faturaIds = [4, 5, 6];
      const pessoaIds = [7, 8, 9];
      const dataInicio = new Date();
      const dataFim = new Date();
      const page = 1;
      const limit = 100;
      const relations = ['itens'] as any;
      const faturas = faturaFakeRepository.findPaginate();

      const result = await controller.find(empresaIds, faturaIds, pessoaIds, dataInicio, dataFim, relations, page, limit);

      expect(service.find).toHaveBeenCalledWith({ empresaIds, faturaIds, pessoaIds, dataInicio, dataFim }, page, limit, relations);
      expect(result).toEqual(faturas);
    });
  });

  describe('findById', () => {
    it('should find a fatura by id', async () => {
      const empresa = { id: 1 } as any;
      const id = 2;
      const relations = ['itens'] as any;
      const fatura = faturaFakeRepository.findOne();

      const result = await controller.findById(empresa, id, relations);

      expect(service.findById).toHaveBeenCalledWith(empresa.id, id, relations);
      expect(result).toEqual(fatura);
    });
  });

  describe('update', () => {
    it('should update a fatura', async () => {
      const empresa = { id: 1 } as any;
      const id = 2;
      const updateFaturaDto: UpdateFaturaManualDto = {};
      const fatura = faturaFakeRepository.findOne();

      const result = await controller.update(empresa, id, updateFaturaDto);

      expect(service.update).toHaveBeenCalledWith(empresa.id, id, updateFaturaDto);
      expect(result).toEqual(fatura);
    });
  });

  describe('cancelar', () => {
    it('should cancel a fatura', async () => {
      const empresa = { id: 1 } as any;
      const id = 2;
      const fatura = { ...faturaFakeRepository.findOne(), situacao: FaturaSituacao.Cancelada };

      jest.spyOn(service, 'cancelar').mockResolvedValue(fatura);

      const result = await controller.cancelar(empresa, id);

      expect(service.cancelar).toHaveBeenCalledWith(empresa.id, id);
      expect(result).toEqual(fatura);
    });
  });
});
