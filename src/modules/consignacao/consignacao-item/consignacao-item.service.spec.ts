import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { ConsignacaoItemService } from './consignacao-item.service';
import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemFilter } from './filters/consignacao-item.filter';
import { UpsertConsignacaoItemDto } from './dto/upsert-consignacao-item.dto';

describe('ConsignacaoItemService', () => {
  let service: ConsignacaoItemService;
  let repository: Repository<ConsignacaoItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsignacaoItemService,
        {
          provide: getRepositoryToken(ConsignacaoItemEntity),
          useValue: {
            upsert: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('find', () => {
    it('should return all consignacao items without filters', async () => {
      const filters: ConsignacaoItemFilter = undefined;
      const expectedItems: ConsignacaoItemEntity[] = [{ consignacaoId: 1 }, { consignacaoId: 2 }] as any;

      jest.spyOn(repository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(expectedItems);

      const result = await service.find(filters);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('i');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('i.empresaId IS NOT NULL');
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalled();

      expect(result).toEqual(expectedItems);
    });

    it('should return consignacao items with filters', async () => {
      const filters: ConsignacaoItemFilter = { empresaIds: [1], consignacaoIds: [1], romaneiroIds: [1], produtoIds: [1] };
      const expectedItems: ConsignacaoItemEntity[] = [{ consignacaoId: 1 }, { consignacaoId: 2 }] as any;

      jest.spyOn(repository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(expectedItems);

      const result = await service.find(filters);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('i');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('i.empresaId IS NOT NULL');
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(4);
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.empresaId IN (:...empresaIds)', {
        empresaIds: filters.empresaIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.consignacaoId IN (:...consignacaoIds)', {
        consignacaoIds: filters.consignacaoIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.romaneiroId IN (:...romaneiroIds)', {
        romaneiroIds: filters.romaneiroIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('i.produtoId IN (:...produtoIds)', {
        produtoIds: filters.produtoIds,
      });

      expect(result).toEqual(expectedItems);
    });
  });

  describe('upsert', () => {
    it('should upsert consignacao items', async () => {
      const operadorId = 1;
      const dto: UpsertConsignacaoItemDto[] = [
        new UpsertConsignacaoItemDto({ empresaId: 1, consignacaoId: 1, romaneioId: 1, sequencia: 1, produtoId: 1, quantidade: 1 }),
      ];

      jest.spyOn(repository, 'upsert').mockResolvedValueOnce(undefined);

      await service.upsert(dto);

      expect(repository.upsert).toHaveBeenCalledWith([...dto.map((x) => ({ ...x, operadorId }))], {
        conflictPaths: ['consignacaoId', 'romaneioId', 'sequencia', 'produtoId'],
      });
    });
  });
});
