import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { estoqueFakeRepository } from 'src/base-fake/estoque';

import { EstoqueEntity } from './entities/estoque.entity';
import { EstoqueService } from './estoque.service';
import { EstoqueView } from './views/estoque.view';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(estoqueFakeRepository.findPaginate()),
}));

describe('EstoqueService', () => {
  let service: EstoqueService;
  let repository: Repository<EstoqueEntity>;
  let view: Repository<EstoqueView>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstoqueService,
        {
          provide: getRepositoryToken(EstoqueEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(EstoqueView),
          useValue: {
            findOne: jest.fn().mockResolvedValue(estoqueFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(estoqueFakeRepository.find()),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              cache: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockReturnThis(),
              clone: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EstoqueService>(EstoqueService);
    repository = module.get<Repository<EstoqueEntity>>(getRepositoryToken(EstoqueEntity));
    view = module.get<Repository<EstoqueView>>(getRepositoryToken(EstoqueView));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
  });

  describe('find', () => {
    it('should return a pagination of EstoqueView with filter', async () => {
      const result = estoqueFakeRepository.findPaginate();

      const filter = {
        empresaIds: [1],
        referenciaIds: [2],
        referenciaIdExternos: ['ref1'],
        produtoIds: [3],
        produtoIdExternos: ['prod1'],
        corIds: [4],
        tamanhoIds: [5],
      };
      const page = 1;
      const limit = 100;

      const pagination = await service.find(filter, page, limit);

      expect(pagination).toEqual(result);
    });

    it('should return a pagination of EstoqueView without filter', async () => {
      const result = estoqueFakeRepository.findPaginate();

      const filter = undefined;
      const page = undefined;
      const limit = undefined;

      const pagination = await service.find(filter, page, limit);

      expect(pagination).toEqual(result);
    });

    it('should return a pagination of EstoqueView with filter empty', async () => {
      const result = estoqueFakeRepository.findPaginate();

      const filter = {
        empresaIds: [],
        referenciaIds: [],
        referenciaIdExternos: [],
        produtoIds: [],
        produtoIdExternos: [],
        corIds: [],
        tamanhoIds: [],
      };
      const page = 1;
      const limit = 100;

      const pagination = await service.find(filter, page, limit);

      expect(pagination).toEqual(result);
    });
  });

  describe('findByProdutoId', () => {
    it('should return a EstoqueView with filter', async () => {
      const result = estoqueFakeRepository.findOne();
      const empresaId = 1;
      const produtoId = 2;

      const pagination = await service.findByProdutoId(empresaId, produtoId);

      expect(pagination).toEqual(result);
    });
  });

  describe('findProdutoIds', () => {
    it('should return a array of produtoIds', async () => {
      const empresaId = 1;
      const produtoIds = [2, 3];

      const result = await service.findByProdutoIds(empresaId, produtoIds);

      expect(view.find).toHaveBeenCalledTimes(1);
      expect(view.find).toHaveBeenCalledWith({ where: { empresaId, produtoId: In(produtoIds) } });
      expect(result).toEqual(estoqueFakeRepository.find());
    });
  });
});
