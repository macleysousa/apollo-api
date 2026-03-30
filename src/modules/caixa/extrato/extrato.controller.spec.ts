import { Test, TestingModule } from '@nestjs/testing';

import { empresaFakeRepository } from 'src/base-fake/empresa';

import { CaixaExtratoEntity } from './entities/extrato.entity';
import { CaixaExtratoController } from './extrato.controller';
import { CaixaExtratoService } from './extrato.service';

describe('CaixaExtratoController', () => {
  let controller: CaixaExtratoController;
  let service: CaixaExtratoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaixaExtratoController],
      providers: [
        {
          provide: CaixaExtratoService,
          useValue: {
            find: jest.fn(),
            findByDocumento: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CaixaExtratoController>(CaixaExtratoController);
    service = module.get<CaixaExtratoService>(CaixaExtratoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (GET)', () => {
    it('should return an array of CaixaExtratoEntity', async () => {
      const empresa = empresaFakeRepository.findOne();
      const caixaId = 2;
      const expectedResult = [new CaixaExtratoEntity()];

      jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

      const result = await controller.find(empresa, caixaId);

      expect(result).toEqual(expectedResult);
      expect(service.find).toHaveBeenCalledWith(empresa.id, caixaId);
    });
  });

  describe('/:documento (GET)', () => {
    it('should return a CaixaExtratoEntity', async () => {
      const empresa = empresaFakeRepository.findOne();
      const caixaId = 2;
      const documento = 3;
      const expectedResult = new CaixaExtratoEntity();

      jest.spyOn(service, 'findByDocumento').mockResolvedValue(expectedResult);

      const result = await controller.findByDocumento(empresa, caixaId, documento);

      expect(service.findByDocumento).toHaveBeenCalledWith(empresa.id, caixaId, documento);
      expect(result).toEqual(expectedResult);
    });
  });
});
