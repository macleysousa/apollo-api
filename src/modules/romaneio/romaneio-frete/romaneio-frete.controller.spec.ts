import { Test, TestingModule } from '@nestjs/testing';

import { romaneioFakeRepository } from 'src/base-fake/romaneio';
import { ContextService } from 'src/context/context.service';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

import { RomaneioService } from '../romaneio.service';
import { CreateRomaneioFreteDto } from './dto/create-romaneio-frete.dto';
import { FreteTipo } from './enum/frete-tipo';
import { RomaneioFreteController } from './romaneio-frete.controller';
import { RomaneioFreteService } from './romaneio-frete.service';

describe('RomaneioFreteController', () => {
  let controller: RomaneioFreteController;
  let service: RomaneioFreteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RomaneioFreteController],
      providers: [
        {
          provide: RomaneioFreteService,
          useValue: {
            upsert: jest.fn().mockResolvedValue(romaneioFakeRepository.findFrete()),
            findByRomaneioId: jest.fn().mockResolvedValue(romaneioFakeRepository.findFrete()),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RomaneioService,
          useValue: {
            findById: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue({ id: 1 }),
            currentBranch: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-13') }),
          },
        },
      ],
    }).compile();

    controller = module.get<RomaneioFreteController>(RomaneioFreteController);
    service = module.get<RomaneioFreteService>(RomaneioFreteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should call service.upsert() with the correct parameters', async () => {
      const empresa = { id: 1 } as EmpresaEntity;
      const romanioId = 1;
      const createRomaneioFreteDto: CreateRomaneioFreteDto = { tipo: FreteTipo.CIF, valor: 100, prazo: 10, observacao: 'Observação' };

      const result = await controller.create(empresa, romanioId, createRomaneioFreteDto);

      expect(service.upsert).toHaveBeenCalledWith(empresa.id, romanioId, createRomaneioFreteDto);
      expect(result).toEqual(romaneioFakeRepository.findFrete());
    });
  });

  describe('/ (GET)', () => {
    it('should call service.findByRomaneioId() with the correct parameters', async () => {
      const empresa = { id: 1 } as EmpresaEntity;
      const romanioId = 1;

      const result = await controller.findByRomaneioId(empresa, romanioId);

      expect(service.findByRomaneioId).toHaveBeenCalledWith(empresa.id, romanioId);
      expect(result).toEqual(romaneioFakeRepository.findFrete());
    });
  });

  describe('/ (DELETE)', () => {
    it('should call service.delete() with the correct parameters', async () => {
      const empresa = { id: 1 } as EmpresaEntity;
      const romanioId = 1;

      await controller.delete(empresa, romanioId);

      expect(service.delete).toHaveBeenCalledWith(empresa.id, romanioId);
    });
  });
});
