import { Test, TestingModule } from '@nestjs/testing';

import { empresaFakeRepository } from 'src/base-fake/empresa';

import { UpsertParcelaDto } from './dto/upsert-parcela.dto';
import { FaturaParcelaEntity } from './entities/parcela.entity';
import { FaturaParcelaController } from './parcela.controller';
import { FaturaParcelaService } from './parcela.service';

describe('FaturaParcelaController', () => {
  let controller: FaturaParcelaController;
  let service: FaturaParcelaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaturaParcelaController],
      providers: [
        {
          provide: FaturaParcelaService,
          useValue: {
            add: jest.fn(),
            findByFaturaId: jest.fn(),
            findByParcela: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FaturaParcelaController>(FaturaParcelaController);
    service = module.get<FaturaParcelaService>(FaturaParcelaService);
  });

  describe('/ (POST)', () => {
    it('should return a FaturaParcelaEntity', async () => {
      const faturaId = 1;
      const dto = new UpsertParcelaDto();
      const expectedResult = new FaturaParcelaEntity();

      jest.spyOn(service, 'add').mockResolvedValue(expectedResult);

      const result = await controller.add(faturaId, dto);

      expect(service.add).toHaveBeenCalledWith(faturaId, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('/ (GET)', () => {
    it('should return an array of FaturaParcelaEntity', async () => {
      const empresa = empresaFakeRepository.findOne();
      const faturaId = 2;
      const expectedResult = [new FaturaParcelaEntity()];

      jest.spyOn(service, 'findByFaturaId').mockResolvedValue(expectedResult);

      const result = await controller.findByFaturaId(empresa, faturaId);

      expect(service.findByFaturaId).toHaveBeenCalledWith(empresa.id, faturaId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('/:parcela (GET)', () => {
    it('should return a FaturaParcelaEntity', async () => {
      const empresa = empresaFakeRepository.findOne();
      const faturaId = 2;
      const parcelaId = 3;
      const expectedResult = new FaturaParcelaEntity();

      jest.spyOn(service, 'findByParcela').mockResolvedValue(expectedResult);

      const result = await controller.findByParcela(empresa, faturaId, parcelaId);

      expect(service.findByParcela).toHaveBeenCalledWith(empresa.id, faturaId, parcelaId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('/:parcela (DELETE)', () => {
    it('should call the remove method of the service', async () => {
      const empresa = empresaFakeRepository.findOne();
      const faturaId = 2;
      const parcelaId = 3;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(empresa, faturaId, parcelaId);

      expect(service.remove).toHaveBeenCalledWith(empresa.id, faturaId, parcelaId);
    });
  });
});
