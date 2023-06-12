import { Test, TestingModule } from '@nestjs/testing';

import { romaneioFakeRepository } from 'src/base-fake/romaneio';
import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { RomaneioController } from './romaneio.controller';
import { RomaneioService } from './romaneio.service';

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
            observacao: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
            cancelar: jest.fn().mockResolvedValue({ ...romaneioFakeRepository.findOneView(), sutuacao: 'Cancelado' }),
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
      const result = await controller.find();

      expect(service.find).toHaveBeenCalled();
      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });
  });

  describe('/:id (GET)', () => {
    it('should find a romaneio by id', async () => {
      const id = 1;
      const romaneioView = romaneioFakeRepository.findOneView();

      const result = await controller.findOne(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(romaneioView);
    });
  });

  describe('/:id/observacao (PUT)', () => {
    it('should update a romaneio observacao', async () => {
      const id = 1;
      const observacao: OperacaoRomaneioDto = { observacao: 'observacao' };
      const romaneioView = romaneioFakeRepository.findOneView();

      const result = await controller.observacao(id, observacao);

      expect(service.observacao).toHaveBeenCalledWith(id, observacao);
      expect(result).toEqual(romaneioView);
    });
  });

  describe('/:id/cancelar (PUT)', () => {
    it('should cancel a romaneio by id', async () => {
      const id = 1;
      const romaneioView = { ...romaneioFakeRepository.findOneView(), sutuacao: 'Cancelado' };
      jest.spyOn(service, 'cancelar').mockResolvedValueOnce(romaneioView);

      const result = await controller.cancelar(id);

      expect(service.cancelar).toHaveBeenCalledWith(id);
      expect(result).toEqual(romaneioView);
    });
  });
});
