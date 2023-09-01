import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { ConsignacaoService } from './consignacao.service';
import { ConsignacaoEntity } from './entities/consignacao.entity';
import { RomaneioItemService } from '../romaneio/romaneio-item/romaneio-item.service';
import { ConsignacaoItemService } from './consignacao-item/consignacao-item.service';
import { OpenConsignacaoDto } from './dto/open-consignacao.dto';
import { ConsignacaoFilter } from './filters/consignacao-filter';
import { ConsignacaoIncluir } from './includes/consignacao.includ';
import { UpdateConsignacaoDto } from './dto/update-consignacao.dto';
import { UpsertConsignacaoItemDto } from './consignacao-item/dto/upsert-consignacao-item.dto';
import { CancelConsinacaoDto } from './dto/cancelar-consignacao.dto';

describe('ConsignacaoService', () => {
  let service: ConsignacaoService;
  let repository: Repository<ConsignacaoEntity>;
  let contextService: ContextService;
  let romaneioItemService: RomaneioItemService;
  let consignacaoItemService: ConsignacaoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsignacaoService,
        {
          provide: getRepositoryToken(ConsignacaoEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
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
            empresaId: jest.fn().mockReturnValue(1),
            data: jest.fn().mockReturnValue(new Date('2023-08-31')),
          },
        },
        {
          provide: RomaneioItemService,
          useValue: {
            findByConsignacaoIds: jest.fn(),
          },
        },
        {
          provide: ConsignacaoItemService,
          useValue: {
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConsignacaoService>(ConsignacaoService);
    repository = module.get<Repository<ConsignacaoEntity>>(getRepositoryToken(ConsignacaoEntity));
    contextService = module.get<ContextService>(ContextService);
    romaneioItemService = module.get<RomaneioItemService>(RomaneioItemService);
    consignacaoItemService = module.get<ConsignacaoItemService>(ConsignacaoItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
    expect(romaneioItemService).toBeDefined();
    expect(consignacaoItemService).toBeDefined();
  });

  describe('open', () => {
    it('should throw BadRequestException if there is already an open consignacao for the given pessoaId', async () => {
      const pessoaConsignacao = [{ pessoaId: 1 }] as ConsignacaoEntity[];
      const dto = { pessoaId: 1, observacao: 'Observação' } as OpenConsignacaoDto;

      jest.spyOn(service, 'find').mockResolvedValueOnce(pessoaConsignacao);

      await expect(service.open(dto)).rejects.toThrowError('Já existe uma consignação aberta para esta pessoa');
      expect(service.find).toHaveBeenCalledWith({ empresaIds: [1], pessoaIds: [1], situacoes: ['aberta'] });
    });

    it('should create a new consignacao', async () => {
      const expectedConsignacao = { id: 1, empresaId: 1, dataAbertura: new Date(), operadorId: 1, situacao: 'aberta' } as ConsignacaoEntity;
      const dto = { pessoaId: 1, observacao: 'Observação' } as OpenConsignacaoDto;

      jest.spyOn(service, 'find').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(expectedConsignacao);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(expectedConsignacao);

      const result = await service.open(dto);

      expect(result).toEqual(expectedConsignacao);
      expect(repository.save).toHaveBeenCalledWith({
        ...dto,
        empresaId: 1,
        dataAbertura: expect.any(Date),
        operadorId: 1,
        situacao: 'aberta',
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('find', () => {
    it('should return consignacoes without filters', async () => {
      const expectedConsignacoes = [{ id: 1 }, { id: 2 }] as ConsignacaoEntity[];
      const filter: ConsignacaoFilter = {};

      jest.spyOn(repository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(expectedConsignacoes);

      const result = await service.find(filter);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('c');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('c.empresaId IS NOT NULL');
      expect(result).toEqual(expectedConsignacoes);
    });

    it('should return consignacoes with filters', async () => {
      const expectedConsignacoes = [{ id: 1 }, { id: 2 }] as ConsignacaoEntity[];
      const filter: ConsignacaoFilter = {
        empresaIds: [1, 2],
        pessoaIds: [1, 2],
        funcionarioIds: [1, 2],
        situacoes: ['aberta', 'fechada'],
      };

      jest.spyOn(repository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(expectedConsignacoes);

      const result = await service.find(filter);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('c');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('c.empresaId IS NOT NULL');
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('c.empresaId IN (:...empresaIds)', {
        empresaIds: filter.empresaIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('c.pessoaId IN (:...pessoaIds)', {
        pessoaIds: filter.pessoaIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('c.funcionarioId IN (:...funcionarioIds)', {
        funcionarioIds: filter.funcionarioIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('c.situacao IN (:...situacoes)', {
        situacoes: filter.situacoes,
      });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalled();

      expect(result).toEqual(expectedConsignacoes);
    });
  });

  describe('findById', () => {
    it('should return consignacao', async () => {
      const empresaId = 1;
      const id = 1;
      const expectedConsignacao = { id: 1 } as ConsignacaoEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(expectedConsignacao);

      const result = await service.findById(empresaId, id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, id } });
      expect(result).toEqual(expectedConsignacao);
    });

    it('should return consignacao with relations', async () => {
      const empresaId = 1;
      const id = 1;
      const expectedConsignacao = { id: 1 } as ConsignacaoEntity;
      const relations: ConsignacaoIncluir[] = ['itens'];

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(expectedConsignacao);

      const result = await service.findById(empresaId, id, relations);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { empresaId, id }, relations });
      expect(result).toEqual(expectedConsignacao);
    });
  });

  describe('update', () => {
    it('should update a consignacao', async () => {
      const expectedConsignacao = { id: 1, empresaId: 1, dataAbertura: new Date(), operadorId: 1, situacao: 'aberta' } as ConsignacaoEntity;
      const dto: UpdateConsignacaoDto = { observacao: 'Nova observação' };
      const empresaId = 1;
      const id = 1;
      const operadorId = 1;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(expectedConsignacao);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(expectedConsignacao);

      const result = await service.update(1, 1, dto);

      expect(result).toEqual(expectedConsignacao);
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(repository.update).toHaveBeenCalledWith({ empresaId, id }, { ...dto, operadorId });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
    });

    it('should throw BadRequestException if consignacao is not "aberta"', async () => {
      const consignacao = { id: 1, empresaId: 1, dataAbertura: new Date(), operadorId: 1, situacao: 'fechada' } as ConsignacaoEntity;
      const dto: UpdateConsignacaoDto = { observacao: 'Nova observação' };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(consignacao);

      await expect(service.update(1, 1, dto)).rejects.toThrowError('Consignação não está com situação "aberta"');
      expect(service.findById).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('calculate', () => {
    it('should calculate consignacao items', async () => {
      const romaneiosItens = [
        {
          empresaId: 1,
          consignacaoId: 1,
          romaneioId: 1,
          sequencia: 1,
          produtoId: 1,
          quantidade: 10,
          operacao: 'consignacao_saida',
        },
        {
          empresaId: 1,
          consignacaoId: 1,
          romaneioId: 2,
          sequencia: 2,
          produtoId: 1,
          quantidade: 5,
          operacao: 'consignacao_devolucao',
          romaneioOrigemId: 2,
          romaneioOrigemSequencia: 2,
        },
        {
          empresaId: 1,
          consignacaoId: 1,
          romaneioId: 3,
          sequencia: 3,
          produtoId: 1,
          quantidade: 3,
          operacao: 'consignacao_acerto',
          romaneioOrigemId: 3,
          romaneioOrigemSequencia: 3,
        },
      ] as any[];

      const expectedProdutos: UpsertConsignacaoItemDto[] = [
        {
          empresaId: 1,
          consignacaoId: 1,
          romaneioId: 1,
          sequencia: 1,
          produtoId: 1,
          quantidade: 10,
          devolvido: 5,
          acertado: 3,
        },
      ];

      jest.spyOn(romaneioItemService, 'findByConsignacaoIds').mockResolvedValueOnce(romaneiosItens);
      jest.spyOn(consignacaoItemService, 'upsert').mockResolvedValueOnce(undefined);

      await service.calculate(1);

      expect(romaneioItemService.findByConsignacaoIds).toHaveBeenCalledWith([1], undefined, ['encerrado']);
      expect(consignacaoItemService.upsert).toHaveBeenCalledWith(expectedProdutos);
    });
  });

  describe('cancel', () => {
    it('should cancel a consignacao', async () => {
      const consignacao = {
        id: 1,
        empresaId: 1,
        dataAbertura: new Date(),
        operadorId: 1,
        situacao: 'aberta',
        itens: [],
      } as ConsignacaoEntity;
      const dto = { motivoCancelamento: 'Motivo de cancelamento' } as CancelConsinacaoDto;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(consignacao);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await service.cancel(1, 1, dto);

      expect(service.findById).toHaveBeenCalledWith(1, 1, ['itens']);
      expect(repository.update).toHaveBeenCalledWith(
        { empresaId: 1, id: 1 },
        { situacao: 'cancelada', motivoCancelamento: dto.motivoCancelamento, operadorId: 1 }
      );
    });

    it('should throw BadRequestException if consignacao is not "aberta"', async () => {
      const consignacao = {
        id: 1,
        empresaId: 1,
        dataAbertura: new Date(),
        operadorId: 1,
        situacao: 'fechada',
        itens: [],
      } as ConsignacaoEntity;
      const dto: CancelConsinacaoDto = { motivoCancelamento: 'Motivo de cancelamento' };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(consignacao);

      await expect(service.cancel(1, 1, dto)).rejects.toThrowError('Consignação não está com situação "aberta"');
      expect(service.findById).toHaveBeenCalledWith(1, 1, ['itens']);
    });

    it('should throw BadRequestException if consignacao has items', async () => {
      const consignacao = {
        id: 1,
        empresaId: 1,
        dataAbertura: new Date(),
        operadorId: 1,
        situacao: 'aberta',
        itens: [{ id: 1 }] as any[],
      } as ConsignacaoEntity;

      const dto: CancelConsinacaoDto = { motivoCancelamento: 'Motivo de cancelamento' };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(consignacao);

      await expect(service.cancel(1, 1, dto)).rejects.toThrowError('Consignação possui itens');
      expect(service.findById).toHaveBeenCalledWith(1, 1, ['itens']);
    });
  });
});
