import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CaixaExtratoEntity } from './entities/extrato.entity';
import { CaixaExtratoService } from './extrato.service';

describe('CaixaExtratoService', () => {
  let service: CaixaExtratoService;
  let repository: Repository<CaixaExtratoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaixaExtratoService,
        {
          provide: getRepositoryToken(CaixaExtratoEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CaixaExtratoService>(CaixaExtratoService);
    repository = module.get<Repository<CaixaExtratoEntity>>(getRepositoryToken(CaixaExtratoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of CaixaExtratoEntity', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const expectedResult = [new CaixaExtratoEntity()];

      jest.spyOn(repository, 'find').mockResolvedValue(expectedResult);

      const result = await service.find(empresaId, caixaId);

      expect(repository.find).toHaveBeenCalledWith({ where: { empresaId, caixaId } });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByDocumento', () => {
    it('should return a CaixaExtratoEntity', async () => {
      const empresaId = 1;
      const caixaId = 2;
      const documento = 3;
      const expectedResult = new CaixaExtratoEntity();

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedResult);

      const result = await service.findByDocumento(empresaId, caixaId, documento);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, caixaId, documento } });
      expect(result).toEqual(expectedResult);
    });
  });
});
