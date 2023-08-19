import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRomaneioFreteDto } from './dto/create-romaneio-frete.dto';
import { RomaneioFreteEntity } from './entities/romaneio-frete.entity';
import { TipoFrete } from '../../../commons/enum/tipo-frete';
import { RomaneioFreteService } from './romaneio-frete.service';

describe('RomaneioFreteService', () => {
  let service: RomaneioFreteService;
  let repository: Repository<RomaneioFreteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioFreteService,
        {
          provide: getRepositoryToken(RomaneioFreteEntity),
          useValue: {
            upsert: jest.fn().mockResolvedValue(undefined),
            findOne: jest.fn().mockResolvedValue({ empresaId: 1, romaneioId: 1, tipo: TipoFrete.CIF, valor: 100, prazo: 10 }),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<RomaneioFreteService>(RomaneioFreteService);
    repository = module.get<Repository<RomaneioFreteEntity>>(getRepositoryToken(RomaneioFreteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('upsert', () => {
    it('should call repository.upsert() with the correct parameters', async () => {
      const empresaId = 1;
      const romaneioId = 1;
      const createRomaneioFreteDto: CreateRomaneioFreteDto = { tipo: TipoFrete.CIF, valor: 100, prazo: 10, observacao: 'Observação' };
      const romaneioFreteResult = { empresaId: 1, romaneioId: 1, ...createRomaneioFreteDto } as any;

      jest.spyOn(service, 'findByRomaneioId').mockResolvedValueOnce(romaneioFreteResult);

      const result = await service.upsert(empresaId, romaneioId, createRomaneioFreteDto);

      expect(repository.upsert).toHaveBeenCalledWith(
        { ...createRomaneioFreteDto, empresaId, romaneioId },
        { conflictPaths: ['empresaId', 'romaneioId'] }
      );

      expect(service.findByRomaneioId).toHaveBeenCalledWith(empresaId, romaneioId);
      expect(result).toEqual(romaneioFreteResult);
    });
  });

  describe('findByRomaneioId', () => {
    it('should call repository.findOne() with the correct parameters', async () => {
      const empresaId = 1;
      const romaneioId = 1;
      const romaneioFreteResult = { empresaId: 1, romaneioId: 1, tipo: TipoFrete.CIF, valor: 100, prazo: 10 } as any;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(romaneioFreteResult);

      const result = await service.findByRomaneioId(empresaId, romaneioId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, romaneioId } });
      expect(result).toEqual(romaneioFreteResult);
    });
  });

  describe('delete', () => {
    it('should call repository.delete() with the correct parameters', async () => {
      const empresaId = 1;
      const romaneioId = 1;

      await service.delete(empresaId, romaneioId);

      expect(repository.delete).toHaveBeenCalledWith({ empresaId, romaneioId });
    });

    it('should throw an error if repository.delete() throws an error', async () => {
      const empresaId = 1;
      const romaneioId = 1;
      const error = new Error('Test');

      jest.spyOn(repository, 'delete').mockRejectedValueOnce(error);

      await expect(service.delete(empresaId, romaneioId)).rejects.toThrow(BadRequestException);
    });
  });
});
