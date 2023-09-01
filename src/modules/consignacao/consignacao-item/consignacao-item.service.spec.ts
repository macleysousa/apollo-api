import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { ConsignacaoItemService } from './consignacao-item.service';
import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemFilter } from './filters/consignacao-item.filter';
import { UpsertConsignacaoItemDto } from './dto/upsert-consignacao-item.dto';
import { ConsignacaoItemView } from './views/consignacao-item.view';

describe('ConsignacaoItemService', () => {
  let service: ConsignacaoItemService;
  let repository: Repository<ConsignacaoItemEntity>;
  let view: Repository<ConsignacaoItemView>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsignacaoItemService,
        {
          provide: getRepositoryToken(ConsignacaoItemEntity),
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ConsignacaoItemView),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            operadorId: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<ConsignacaoItemService>(ConsignacaoItemService);
    repository = module.get<Repository<ConsignacaoItemEntity>>(getRepositoryToken(ConsignacaoItemEntity));
    view = module.get<Repository<ConsignacaoItemView>>(getRepositoryToken(ConsignacaoItemView));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
  });

  describe('find', () => {
    it('should return all consignacao items without filters', async () => {
      const filters: ConsignacaoItemFilter = undefined;
      const expectedItems: ConsignacaoItemView[] = [{ consignacaoId: 1 }, { consignacaoId: 2 }] as any;

      jest.spyOn(view.createQueryBuilder(), 'getMany').mockResolvedValueOnce(expectedItems);

      const result = await service.find(filters);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('i');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('i.empresaId IS NOT NULL');
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalled();

      expect(result).toEqual(expectedItems);
    });

    it('should return consignacao items with filters', async () => {
      const filters: ConsignacaoItemFilter = { empresaIds: [1], consignacaoIds: [1], romaneiroIds: [1], produtoIds: [1] };
      const expectedItems: ConsignacaoItemView[] = [{ consignacaoId: 1 }, { consignacaoId: 2 }] as any;

      jest.spyOn(view.createQueryBuilder(), 'getMany').mockResolvedValueOnce(expectedItems);

      const result = await service.find(filters);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('i');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('i.empresaId IS NOT NULL');
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledTimes(4);
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.empresaId IN (:...empresaIds)', {
        empresaIds: filters.empresaIds,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.consignacaoId IN (:...consignacaoIds)', {
        consignacaoIds: filters.consignacaoIds,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.romaneiroId IN (:...romaneiroIds)', {
        romaneiroIds: filters.romaneiroIds,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.produtoId IN (:...produtoIds)', {
        produtoIds: filters.produtoIds,
      });

      expect(result).toEqual(expectedItems);
    });
  });

  describe('upsert', () => {
    it('should upsert consignacao items', async () => {
      const operadorId = 1;
      const dto: UpsertConsignacaoItemDto[] = [
        new UpsertConsignacaoItemDto({ empresaId: 1, consignacaoId: 1, romaneioId: 1, sequencia: 1, produtoId: 1, solicitado: 1 }),
      ];

      jest.spyOn(repository, 'upsert').mockResolvedValueOnce(undefined);

      await service.upsert(dto);

      expect(repository.upsert).toHaveBeenCalledWith([...dto.map((x) => ({ ...x, operadorId }))], {
        conflictPaths: ['consignacaoId', 'romaneioId', 'sequencia', 'produtoId'],
      });
    });
  });
});
