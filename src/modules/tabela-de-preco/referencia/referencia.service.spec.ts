import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { tableaDePrecoFakeRepository } from 'src/base-fake/tabela-de-preco';

import { PrecoReferencia } from './entities/referencia.entity';
import { PrecoReferenciaView } from './views/referencia.view';
import { TabelaDePrecoService } from '../tabela-de-preco.service';
import { PrecoReferenciaService } from './referencia.service';
import { ImportPrecoDto } from './dto/import-precos.dto';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findViewPaginate()),
}));
describe('PrecoReferenciaService', () => {
  let service: PrecoReferenciaService;
  let repository: Repository<PrecoReferencia>;
  let view: Repository<PrecoReferenciaView>;
  let tabelaService: TabelaDePrecoService;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrecoReferenciaService,
        {
          provide: getRepositoryToken(PrecoReferencia),
          useValue: {
            upsert: jest.fn().mockImplementation(undefined),
            find: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.find),
            findOne: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findOne()),
          },
        },
        {
          provide: getRepositoryToken(PrecoReferenciaView),
          useValue: {
            find: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findView),
            findOne: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findOneView()),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.find()),
              getOne: jest.fn().mockResolvedValue(tableaDePrecoFakeRepository.findOne()),
              delete: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue(undefined),
            }),
          },
        },
        {
          provide: TabelaDePrecoService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ terminador: 0.9 }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn().mockReturnValue({ id: 1 }),
            operadorId: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<PrecoReferenciaService>(PrecoReferenciaService);
    repository = module.get<Repository<PrecoReferencia>>(getRepositoryToken(PrecoReferencia));
    view = module.get<Repository<PrecoReferenciaView>>(getRepositoryToken(PrecoReferenciaView));
    tabelaService = module.get<TabelaDePrecoService>(TabelaDePrecoService);
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
    expect(tabelaService).toBeDefined();
    expect(contextService).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert the precos and return the corresponding PrecoReferenciaView entities', async () => {
      const dto: ImportPrecoDto[] = [{ tabelaDePrecoId: 1, referenciaId: 2, valor: 10.0 }];
      const operadorId = 1;
      const precos = dto.map((x) => ({ ...x, operadorId }));
      const expected = [{ tabelaDePrecoId: 1, referenciaId: 2, valor: 10.0 }] as PrecoReferenciaView[];

      jest.spyOn(contextService, 'operadorId').mockReturnValue(operadorId);
      jest.spyOn(repository, 'upsert').mockResolvedValue(undefined);
      jest.spyOn(view, 'find').mockResolvedValue(expected);

      const result = await service.upsert(dto);

      expect(repository.upsert).toHaveBeenCalledWith(precos, { conflictPaths: ['tabelaDePrecoId', 'referenciaId'] });
      expect(view.find).toHaveBeenCalledWith({ where: { tabelaDePrecoId: In([1]), referenciaId: In([2]) } });
      expect(result).toEqual(expected);
    });
  });

  describe('add', () => {
    it('should add a new preco referencia', async () => {
      const tabelaDePrecoId = 1;
      const referenciaId = 1;
      const valor = 3.7;
      const terminador = 0.9;
      const operadorId = 1;
      const precoReferenciaView = tableaDePrecoFakeRepository.findOneView();

      jest.spyOn(service, 'findByReferenciaId').mockResolvedValue(precoReferenciaView);

      const result = await service.add(tabelaDePrecoId, { referenciaId, valor });

      expect(result).toBe(precoReferenciaView);
      expect(repository.upsert).toHaveBeenCalledWith(
        { tabelaDePrecoId, referenciaId, valor: Math.floor(valor) + terminador, operadorId },
        { conflictPaths: ['tabelaDePrecoId', 'referenciaId'] }
      );
      expect(service.findByReferenciaId).toHaveBeenCalledWith(tabelaDePrecoId, referenciaId);
    });
  });

  describe('find', () => {
    it('should find preco referencias by tabela de preco id and referencia ids', async () => {
      const tabelaDePrecoId = 1;
      const referenciaIds = [1, 2, 3];
      const page = 1;
      const limit = 100;
      const pagination = tableaDePrecoFakeRepository.findViewPaginate();

      const result = await service.find(tabelaDePrecoId, { referenciaIds, page, limit });

      expect(view.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith({ tabelaDePrecoId });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith({ referenciaId: In(referenciaIds) });

      expect(result).toEqual(pagination);
    });

    it('should find preco referencias by tabela de preco id and referencia id externos', async () => {
      const tabelaDePrecoId = 1;
      const referenciaIdExternos = ['ref1', 'ref2', 'ref3'];
      const page = 1;
      const limit = 100;
      const pagination = tableaDePrecoFakeRepository.findViewPaginate();

      jest.spyOn(view, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        paginate: jest.fn().mockResolvedValue(pagination),
      } as any);

      const result = await service.find(tabelaDePrecoId, { referenciaIdExternos, page, limit });

      expect(view.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith({ tabelaDePrecoId });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith({ referenciaIdExterno: In(referenciaIdExternos) });

      expect(result).toEqual(pagination);
    });

    it('should find preco referencias by tabela de preco filters undefined', async () => {
      const tabelaDePrecoId = undefined;
      const referenciaIds = undefined;
      const referenciaIdExternos = undefined;
      const page = undefined;
      const limit = undefined;
      const pagination = tableaDePrecoFakeRepository.findViewPaginate();

      jest.spyOn(view, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        paginate: jest.fn().mockResolvedValue(pagination),
      } as any);

      const result = await service.find(tabelaDePrecoId, { referenciaIdExternos, page, limit });

      expect(view.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith({ tabelaDePrecoId });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ referenciaId: In(referenciaIds) });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ referenciaIdExterno: In(referenciaIdExternos) });

      expect(result).toEqual(pagination);
    });
  });

  describe('findByReferenciaId', () => {
    it('should find a preco referencia by referencia id', async () => {
      const tabelaDePrecoId = 1;
      const referenciaId = 1;
      const precoReferenciaView = tableaDePrecoFakeRepository.findOneView();

      const result = await service.findByReferenciaId(tabelaDePrecoId, referenciaId);

      expect(view.findOne).toHaveBeenCalledWith({ where: { tabelaDePrecoId, referenciaId } });
      expect(result).toEqual(precoReferenciaView);
    });
  });
});
