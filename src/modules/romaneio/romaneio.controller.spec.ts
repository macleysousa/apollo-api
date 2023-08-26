import { Test, TestingModule } from '@nestjs/testing';

import { romaneioFakeRepository } from 'src/base-fake/romaneio';

import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { RomaneioController } from './romaneio.controller';
import { RomaneioService } from './romaneio.service';
import { RomaneioFilter } from './filters/romaneio.filter';
import { UpdateRomaneioDto } from './dto/update-romaneio.dto';
import { ContextService } from 'src/context/context.service';

describe('RomaneioController', () => {
  let controller: RomaneioController;
  let service: RomaneioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RomaneioController],
      providers: [
        {
          provide: RomaneioService,
          useValue: {
            create: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
            find: jest.fn().mockResolvedValue(romaneioFakeRepository.findViewPaginate()),
            findById: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
            update: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
            observacao: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
            cancelar: jest.fn().mockResolvedValue({ ...romaneioFakeRepository.findOneView(), sutuacao: 'Cancelado' }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            empresa: jest.fn().mockReturnValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<RomaneioController>(RomaneioController);
    service = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a romaneio', async () => {
      const createRomaneioDto: CreateRomaneioDto = {} as any;
      const romaneioView = romaneioFakeRepository.findOneView();

      const result = await controller.create(createRomaneioDto);

      expect(service.create).toHaveBeenCalledWith(createRomaneioDto);
      expect(result).toEqual(romaneioView);
    });
  });

  describe('/ (GET)', () => {
    it('should find romaneios', async () => {
      const filter: RomaneioFilter = {
        dataInicial: new Date(),
        dataFinal: new Date(),
        empresaIds: [1],
        pessoaIds: [1],
        funcionarioIds: [1],
        modalidades: ['Entrada'],
        operacoes: ['Compra'],
        situacoes: ['Encerrado'],
        incluir: ['itens'],
      };
      const page = 1;
      const limit = 100;

      const result = await controller.find(filter, page, limit);

      expect(service.find).toHaveBeenCalled();
      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });
  });

  describe('/:id (GET)', () => {
    it('should find a romaneio by id', async () => {
      const empresa = { id: 1 } as any;
      const id = 1;
      const romaneioView = romaneioFakeRepository.findOneView();

      const result = await controller.findOne(empresa, id, ['itens'] as any);

      expect(service.findById).toHaveBeenCalledWith(empresa.id, id, ['itens']);
      expect(result).toEqual(romaneioView);
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a romaneio', async () => {
      const empresa = { id: 1 } as any;
      const romaneioId = 1;
      const updateRomaneioDto: UpdateRomaneioDto = {} as any;
      const romaneioView = romaneioFakeRepository.findOneView();

      const result = await controller.update(empresa, romaneioId, updateRomaneioDto);

      expect(service.update).toHaveBeenCalledWith(empresa.id, romaneioId, updateRomaneioDto);
      expect(result).toEqual(romaneioView);
    });
  });

  describe('/:id/observacao (PUT)', () => {
    it('should update a romaneio observacao', async () => {
      const empresa = { id: 1 } as any;
      const id = 1;
      const observacao: OperacaoRomaneioDto = { observacao: 'observacao' };
      const romaneioView = romaneioFakeRepository.findOneView();

      const result = await controller.observacao(empresa, id, observacao);

      expect(service.observacao).toHaveBeenCalledWith(empresa.id, id, observacao);
      expect(result).toEqual(romaneioView);
    });
  });
});
