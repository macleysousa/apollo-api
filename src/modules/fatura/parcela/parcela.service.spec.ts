import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import 'src/extensions/array-extension';

import { ContextService } from 'src/context/context.service';

import { FaturaSituacao } from '../enum/fatura-situacao.enum';
import { FaturaService } from '../fatura.service';
import { UpsertParcelaDto } from './dto/upsert-parcela.dto';
import { FaturaParcelaEntity } from './entities/parcela.entity';
import { ParcelaSituacao } from './enum/parcela-situacao.enum';
import { FaturaParcelaService } from './parcela.service';

describe('FaturaParcelaService', () => {
  let service: FaturaParcelaService;
  let faturaService: FaturaService;
  let contextService: ContextService;
  let repository: Repository<FaturaParcelaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaturaParcelaService,
        {
          provide: getRepositoryToken(FaturaParcelaEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            upsert: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: FaturaService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue({ id: 1 }),
            currentBranch: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-16') }),
          },
        },
      ],
    }).compile();

    service = module.get<FaturaParcelaService>(FaturaParcelaService);
    faturaService = module.get<FaturaService>(FaturaService);
    contextService = module.get<ContextService>(ContextService);
    repository = module.get<Repository<FaturaParcelaEntity>>(getRepositoryToken(FaturaParcelaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(faturaService).toBeDefined();
    expect(contextService).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    const empresaId = 1;
    const faturaId = 2;
    const parcela = 1;
    const valor = 100;

    const usuario = { id: 1 } as any;

    const fatura = { id: faturaId, situacao: FaturaSituacao.Normal, valor: 500 } as any;
    const parcelas = [
      { parcela: 1, valor: 100, situacao: ParcelaSituacao.Normal },
      { parcela: 2, valor: 200, situacao: ParcelaSituacao.Normal },
    ] as any;

    const dto: UpsertParcelaDto = { parcela, valor } as any;

    it('should add a new parcela', async () => {
      jest.spyOn(faturaService, 'findById').mockResolvedValueOnce(fatura);
      jest.spyOn(service, 'findByFaturaId').mockResolvedValueOnce(parcelas);
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce({} as any);

      jest.spyOn(repository, 'upsert').mockResolvedValueOnce(undefined);

      const result = await service.add(faturaId, dto);

      expect(repository.upsert).toHaveBeenCalledWith(
        { ...dto, empresaId, faturaId, vencimento: expect.any(Date), operadorId: usuario.id },
        { conflictPaths: ['empresaId', 'faturaId', 'parcela'] }
      );
      expect(result).toEqual({} as FaturaParcelaEntity);
    });

    it('should throw BadRequestException if fatura is not found', async () => {
      jest.spyOn(faturaService, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.add(faturaId, dto)).rejects.toThrowError('Fatura não encontrada.');
    });

    it('should throw BadRequestException if fatura is not in "normal" situation', async () => {
      jest.spyOn(faturaService, 'findById').mockResolvedValueOnce({ situacao: FaturaSituacao.Cancelada } as any);

      await expect(service.add(faturaId, dto)).rejects.toThrowError(`Fatura ${faturaId} não está com situação "normal".`);
    });

    it('should throw BadRequestException if parcela already exists and is not in "normal" situation', async () => {
      jest.spyOn(faturaService, 'findById').mockResolvedValueOnce({ situacao: FaturaSituacao.Normal } as any);
      jest.spyOn(service, 'findByFaturaId').mockResolvedValueOnce([]);
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce({ situacao: ParcelaSituacao.Paga } as any);

      await expect(service.add(faturaId, dto)).rejects.toThrowError('Parcela não está com situação "normal".');
    });

    it('should throw BadRequestException if sum of parcelas value is greater than fatura value', async () => {
      const parcelaDto = { parcela: 3, valor: 300 } as any;

      jest.spyOn(faturaService, 'findById').mockResolvedValue(fatura);
      jest.spyOn(service, 'findByFaturaId').mockResolvedValue(parcelas);

      await expect(service.add(faturaId, parcelaDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestExceptio: Não foi possível adicionar/alterar a parcela.', async () => {
      jest.spyOn(faturaService, 'findById').mockResolvedValueOnce(fatura);
      jest.spyOn(service, 'findByFaturaId').mockResolvedValueOnce(parcelas);
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce({} as any);

      jest.spyOn(repository, 'upsert').mockRejectedValueOnce(new Error());

      await expect(service.add(faturaId, dto)).rejects.toThrowError('Não foi possível adicionar/alterar a parcela.');
      expect(repository.upsert).toHaveBeenCalledWith(
        { ...dto, empresaId, faturaId, vencimento: expect.any(Date), operadorId: usuario.id },
        { conflictPaths: ['empresaId', 'faturaId', 'parcela'] }
      );
    });
  });

  describe('findByFaturaId', () => {
    it('should return parcelas by fatura id', async () => {
      const empresaId = 1;
      const faturaId = 2;
      const parcelas = [{ parcela: 1, valor: 100 }] as FaturaParcelaEntity[];

      jest.spyOn(repository, 'find').mockResolvedValue(parcelas);

      const result = await service.findByFaturaId(empresaId, faturaId);

      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, faturaId } });
      expect(result).toEqual(parcelas);
    });
  });

  describe('findByParcela', () => {
    it('should return parcelas by parcela', async () => {
      const empresaId = 1;
      const faturaId = 2;
      const parcela = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue({ parcela: 1, valor: 100 } as FaturaParcelaEntity);

      const result = await service.findByParcela(empresaId, faturaId, parcela);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, faturaId, parcela } });
      expect(result).toEqual({ parcela: 1, valor: 100 } as FaturaParcelaEntity);
    });
  });

  describe('remove', () => {
    const empresaId = 1;
    const faturaId = 2;
    const parcela = 1;

    const parcelaEntity = { id: 1, parcela, valor: 100, situacao: ParcelaSituacao.Normal } as any;

    it('should remove a parcela', async () => {
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce(parcelaEntity);

      const deleteSpy = jest.spyOn(repository, 'delete').mockResolvedValueOnce({} as any);

      await service.remove(empresaId, faturaId, parcela);

      expect(deleteSpy).toHaveBeenCalledWith({ empresaId, faturaId, parcela });
    });

    it('should throw NotFoundException if parcela is not found', async () => {
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce(undefined);

      await expect(service.remove(empresaId, faturaId, parcela)).rejects.toThrowError('Parcela não encontrada.');
    });

    it('should throw BadRequestException if fatura is not in "normal" situation', async () => {
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce({ situacao: FaturaSituacao.Cancelada } as any);

      await expect(service.remove(empresaId, faturaId, parcela)).rejects.toThrowError('Parcela não está com situação "normal".');
    });

    it('should throw BadRequestException if parcela is not in "normal" situation', async () => {
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce({ situacao: ParcelaSituacao.Paga } as any);

      await expect(service.remove(empresaId, faturaId, parcela)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException: Não foi possível remover a parcela.', async () => {
      jest.spyOn(service, 'findByParcela').mockResolvedValueOnce(parcelaEntity);

      jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error());

      await expect(service.remove(empresaId, faturaId, parcela)).rejects.toThrow(BadRequestException);
    });
  });
});
