import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { romaneioFakeRepository } from 'src/base-fake/romaneio';
import { ContextService } from 'src/context/context.service';

import { ConsignacaoService } from '../consignacao/consignacao.service';
import { EstoqueService } from '../estoque/estoque.service';
import { PedidoService } from '../pedido/pedido.service';

import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { RomaneioEntity } from './entities/romaneio.entity';
import { ModalidadeRomaneio } from './enum/modalidade-romaneio.enum';
import { OperacaoRomaneio, OperacaoRomaneioType } from './enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from './enum/situacao-romaneio.enum';
import { RomaneioFilter } from './filters/romaneio.filter';
import { RomaneioService } from './romaneio.service';
import { RomaneioView } from './views/romaneio.view';

// Mock the external module and the paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue(romaneioFakeRepository.findViewPaginate()),
}));
describe('RomaneioService', () => {
  let service: RomaneioService;
  let repository: Repository<RomaneioEntity>;
  let view: Repository<RomaneioView>;
  let contextService: ContextService;
  let consignacaoService: ConsignacaoService;
  let pedidoService: PedidoService;
  let estoqueService: EstoqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioService,
        {
          provide: getRepositoryToken(RomaneioEntity),
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            query: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RomaneioView),
          useValue: {
            find: jest.fn().mockResolvedValue(romaneioFakeRepository.findView()),
            findOne: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
            }),
          },
        },
        {
          provide: ContextService,
          useValue: {
            usuario: jest.fn().mockReturnValue({ id: 1 }),
            operadorId: jest.fn().mockReturnValue(1),
            empresa: jest.fn().mockReturnValue({ id: 1, data: new Date('2023-06-05') }),
            data: jest.fn().mockReturnValue('2023-06-05'),
            parametros: jest.fn().mockReturnValue([{ parametroId: 'QT_DIAS_DEVOLUCAO', valor: 60 }]),
          },
        },
        {
          provide: ConsignacaoService,
          useValue: {
            calculate: jest.fn(),
          },
        },
        {
          provide: PedidoService,
          useValue: {
            findById: jest.fn(),
            cancelarFaturamento: jest.fn(),
          },
        },
        {
          provide: EstoqueService,
          useValue: {
            findByProdutoIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RomaneioService>(RomaneioService);
    repository = module.get<Repository<RomaneioEntity>>(getRepositoryToken(RomaneioEntity));
    view = module.get<Repository<RomaneioView>>(getRepositoryToken(RomaneioView));
    contextService = module.get<ContextService>(ContextService);
    consignacaoService = module.get<ConsignacaoService>(ConsignacaoService);
    pedidoService = module.get<PedidoService>(PedidoService);
    estoqueService = module.get<EstoqueService>(EstoqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
    expect(contextService).toBeDefined();
    expect(consignacaoService).toBeDefined();
    expect(pedidoService).toBeDefined();
    expect(estoqueService).toBeDefined();
  });

  describe('create', () => {
    it('should return BadRequestException if consignacao_saida and consignacaoId is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.consignacao_saida,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Consignação não informada');
    });

    it('should return BadRequestException if consignacao_devolucao and consignacaoId is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.consignacao_devolucao,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Consignação não informada');
    });

    it('should return BadRequestException if consignacao_acerto and consignacaoId is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.consignacao_acerto,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Consignação não informada');
    });

    it('should return BadRequestException if consignacao_devolucao and romaneiosConsignacao is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        consignacaoId: 1,
        operacao: OperacaoRomaneio.consignacao_devolucao,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Romaneios de consignação saída não informados');
    });

    it('should return BadRequestException if consignacao_devolucao and romaneiosConsignacao is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        consignacaoId: 1,
        operacao: OperacaoRomaneio.consignacao_acerto,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Romaneios de consignação saída não informados');
    });

    it('should return BadRequestException if compra_devolucao and romaneiosDevolucao is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.compra_devolucao,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Romaneios de devolução não informados');
    });

    it('should return BadRequestException if venda_devolucao and romaneiosDevolucao is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.venda_devolucao,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Romaneios de devolução não informados');
    });

    it('should return BadRequestException if transferencia_devolucao and romaneiosDevolucao is undefined', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.transferencia_devolucao,
      };

      await expect(service.create(createRomaneioDto)).rejects.toThrowError('Romaneios de devolução não informados');
    });

    it('should create a romaneio compra', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.compra,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_COMPRA', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.entrada,
        kardex: true,
        financeiro: true,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio compra_devolucao', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.compra_devolucao,
        romaneiosDevolucao: [1, 2, 3],
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_COMPRA', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.saida,
        kardex: true,
        financeiro: true,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio venda', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.venda,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_VENDA', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.saida,
        kardex: true,
        financeiro: true,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio venda_devolucao', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.venda_devolucao,
        romaneiosDevolucao: [1, 2, 3],
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.entrada,
        kardex: true,
        financeiro: true,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio consignacao_saida', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.consignacao_saida,
        consignacaoId: 1,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_CONSIGNACAO', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.saida,
        kardex: true,
        financeiro: false,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio consignacao_devolucao', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.consignacao_devolucao,
        consignacaoId: 1,
        romaneiosConsignacao: [1, 2, 3],
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_CONSIGNACAO', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.entrada,
        kardex: true,
        financeiro: false,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio consignacao_acerto', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.consignacao_acerto,
        consignacaoId: 1,
        romaneiosConsignacao: [1, 2, 3],
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_VENDA', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.saida,
        kardex: false,
        financeiro: true,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio transferencia_saida', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.transferencia_saida,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_CONSIGNACAO', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.saida,
        kardex: true,
        financeiro: false,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });

    it('should create a romaneio transferencia_entrada', async () => {
      const createRomaneioDto: CreateRomaneioDto = {
        pessoaId: 1,
        tabelaPrecoId: 1,
        funcionarioId: 1,
        operacao: OperacaoRomaneio.transferencia_entrada,
      };
      const currentUser = { id: 1 };
      const currentBranch = { id: 1, data: new Date('2023-06-05') };
      const observacao = '';

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ empresaId: 1, id: 1 } as any);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'OBS_PADRAO_CONSIGNACAO', valor: '' }] as any);

      const result = await service.create(createRomaneioDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...createRomaneioDto,
        empresaId: currentBranch.id,
        data: currentBranch.data,
        modalidade: ModalidadeRomaneio.entrada,
        kardex: true,
        financeiro: false,
        observacao: observacao,
        operadorId: currentUser.id,
        situacao: SituacaoRomaneio.em_andamento,
      });
      expect(service.findById).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual({ empresaId: 1, id: 1 });
    });
  });

  describe('find', () => {
    it('should find romaneios with filter', async () => {
      const filter: RomaneioFilter = {
        dataInicial: new Date(),
        dataFinal: new Date(),
        empresaIds: [1],
        pessoaIds: [1],
        funcionarioIds: [1],
        modalidades: ['entrada'],
        operacoes: ['compra'],
        situacoes: ['encerrado'],
        incluir: ['itens'],
      };
      const page = 1;
      const limit = 100;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('e.empresaId IS NOT NULL');
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.data >= :dataInicial', {
        dataInicial: filter.dataInicial,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.data <= :dataFinal', { dataFinal: filter.dataFinal });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.empresaId IN (:...empresaIds)', {
        empresaIds: filter.empresaIds,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.pessoaId IN (:...pessoaIds)', {
        pessoaIds: filter.pessoaIds,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.funcionarioId IN (:...funcionarioIds)', {
        funcionarioIds: filter.funcionarioIds,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.modalidade IN (:...modalidades)', {
        modalidades: filter.modalidades,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.operacao IN (:...operacoes)', {
        operacoes: filter.operacoes,
      });
      expect(view.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.situacao IN (:...situacoes)', {
        situacoes: filter.situacoes,
      });

      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });

    it('should find romaneios filter empty', async () => {
      const filter = { empresaIds: [], funcionarioIds: [], dataInicial: undefined, dataFinal: undefined };
      const page = undefined;
      const limit = undefined;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('e.empresaId IS NOT NULL');
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ empresaId: In(filter.empresaIds) });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith({ funcionarioId: In(filter.funcionarioIds) });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('e.data >= :dataInicial', {
        dataInicial: filter.dataInicial,
      });
      expect(view.createQueryBuilder().andWhere).not.toHaveBeenCalledWith('e.data <= :dataFinal', {
        dataFinal: filter.dataFinal,
      });

      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });

    it('should find romaneios without filter', async () => {
      const filter = undefined;
      const page = undefined;
      const limit = undefined;

      const result = await service.find(filter, page, limit);

      expect(view.createQueryBuilder).toHaveBeenCalledWith('e');
      expect(view.createQueryBuilder().where).toHaveBeenCalledWith('e.empresaId IS NOT NULL');
      expect(result).toEqual(romaneioFakeRepository.findViewPaginate());
    });
  });

  describe('findById', () => {
    it('should find a romaneio by id', async () => {
      const empresaId = 1;
      const id = 1;
      const relations = ['itens'] as any;

      const result = await service.findById(empresaId, id, relations);

      expect(view.find).toHaveBeenCalledWith({ where: { empresaId: empresaId, romaneioId: id }, relations });
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });
  });

  describe('findByIds', () => {
    it('should find romaneios by ids', async () => {
      const empresaId = 1;
      const ids = [1, 2, 3];
      const relations = ['itens'] as any;

      const result = await service.findByIds(empresaId, ids, relations);

      expect(view.find).toHaveBeenCalledWith({ where: { empresaId: empresaId, romaneioId: In(ids) }, relations });
      expect(result).toEqual(romaneioFakeRepository.findView());
    });
  });

  describe('update', () => {
    it('should not update romaneio not found', async () => {
      const empresaId = 1;
      const id = 1;
      const dto = { descricao: 'Teste' } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(undefined);

      expect(service.update(empresaId, id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id, ['itens']);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should not update romaneio not Em andamento', async () => {
      const empresaId = 1;
      const id = 1;
      const dto = { descricao: 'Teste' } as any;
      const romaneio = { ...romaneioFakeRepository.findOneView(), situacao: SituacaoRomaneio.cancelado };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      expect(service.update(empresaId, id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id, ['itens']);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if update romaneio already have items', async () => {
      const empresaId = 1;
      const id = 1;
      const dto = { descricao: 'Teste' } as any;
      const romaneio = { ...romaneioFakeRepository.findOneView(), itens: [{ id: 1 }] } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      await expect(service.update(empresaId, id, dto)).rejects.toThrowError(
        `Romaneio "${id}" não pode ser alterado pois já possui itens`,
      );
      expect(service.findById).toHaveBeenCalledWith(empresaId, id, ['itens']);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if update romaneio', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const dto = { descricao: 'Teste' } as any;
      const romaneio = { id: 1, situacao: SituacaoRomaneio.em_andamento, operacao: OperacaoRomaneio.outros } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.update(empresaId, id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id, ['itens']);
      expect(repository.update).toHaveBeenCalledWith({ id }, { ...dto, operadorId });
    });

    it('should update a romaneio', async () => {
      const empresaId = 1;
      const operadorId = 1;
      const id = 1;
      const dto = { descricao: 'Teste' } as any;

      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneioFakeRepository.findOneView());

      const result = await service.update(empresaId, id, dto);

      expect(repository.update).toHaveBeenCalledWith({ id }, { ...dto, operadorId });
      expect(service.findById).toHaveBeenCalledWith(empresaId, id, ['itens']);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });
  });

  describe('observacao', () => {
    it('should update observacao', async () => {
      const empresaId = 1;
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: 'Teste' };

      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneioFakeRepository.findOneView());

      const result = await service.observacao(empresaId, id, dto);

      expect(repository.update).toHaveBeenCalledWith({ id }, { observacao: dto.observacao });
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });

    it('should not update observacao romaneio not Em andamento', async () => {
      const empresaId = 1;
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: undefined };
      const romaneio = { ...romaneioFakeRepository.findOneView(), situacao: SituacaoRomaneio.cancelado };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      expect(service.observacao(empresaId, id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if update observacao', async () => {
      const empresaId = 1;
      const id = 1;
      const dto: OperacaoRomaneioDto = { observacao: 'Teste' };
      const romaneio = { id: 1, situacao: SituacaoRomaneio.em_andamento, operacao: OperacaoRomaneio.outros } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.observacao(empresaId, id, dto)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith({ id }, { observacao: dto.observacao });
    });
  });

  describe('validarDevolucao', () => {
    it('should return BadRequestException if romaneios invalid operacao', () => {
      const empresaId = 1;
      const id = 1;
      const operacao: OperacaoRomaneioType = 'venda';
      const romaneiosDevolucao = [1, 2, 3];
      const romaneios = [{ ...romaneioFakeRepository.findOneView(), operacao: OperacaoRomaneio.outros }] as any;
      const romaneio = { ...romaneioFakeRepository.findOneView(), operacao: OperacaoRomaneio.venda_devolucao };

      jest.spyOn(service, 'findByIds').mockResolvedValueOnce(romaneios);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      expect(service.validarDevolucao(empresaId, id, [operacao], romaneiosDevolucao)).rejects.toThrow(BadRequestException);
      expect(service.findByIds).toHaveBeenCalledWith(empresaId, romaneiosDevolucao, ['itens']);
    });

    it('should return true if romaneios are valid', async () => {
      const empresaId = 1;
      const id = 1;
      const operacao: OperacaoRomaneioType = 'venda';
      const romaneiosDevolucao = [1, 2, 3];
      const romaneios = [
        {
          ...romaneioFakeRepository.findOneView(),
          operacao: OperacaoRomaneio.venda,
          itens: romaneioFakeRepository.findViewItens(),
        },
      ];
      const romaneio = {
        ...romaneioFakeRepository.findOneView(),
        operacao: OperacaoRomaneio.venda_devolucao,
        itens: romaneioFakeRepository.findViewItens(),
      };

      jest.spyOn(service, 'findByIds').mockResolvedValueOnce(romaneios);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      const result = await service.validarDevolucao(empresaId, id, [operacao], romaneiosDevolucao);

      expect(service.findByIds).toHaveBeenCalledWith(empresaId, romaneiosDevolucao, ['itens']);
      expect(result).toEqual(true);
    });

    it('should return false if romaneios are invalid', async () => {
      const empresaId = 1;
      const id = 1;
      const operacao: OperacaoRomaneioType = 'venda';
      const romaneiosDevolucao = [1, 2, 3];
      const romaneios = [
        {
          ...romaneioFakeRepository.findOneView(),
          operacao: OperacaoRomaneio.venda,
          itens: [{ ...romaneioFakeRepository.findOneViewItem(), devolvido: 100, quantidade: 100 }],
        },
      ];
      const romaneio = {
        ...romaneioFakeRepository.findOneView(),
        operacao: OperacaoRomaneio.venda_devolucao,
        itens: [{ ...romaneioFakeRepository.findOneViewItem(), quantidade: 1 }],
      };

      jest.spyOn(service, 'findByIds').mockResolvedValueOnce(romaneios);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      const result = await service.validarDevolucao(empresaId, id, [operacao], romaneiosDevolucao);

      expect(service.findByIds).toHaveBeenCalledWith(empresaId, romaneiosDevolucao, ['itens']);
      expect(result).toEqual(false);
    });
  });

  describe('validarEstoque', () => {
    it('should return products with insufficient stock', async () => {
      const empresaId = 1;
      const id = 1;
      const romaneio = { itens: [{ produtoId: 1, quantidade: 100 }] };
      const estoque = [{ produtoId: 1, saldo: 99 }];

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio as any);
      jest.spyOn(estoqueService, 'findByProdutoIds').mockResolvedValueOnce(estoque as any);

      const result = await service.validarEstoque(empresaId, id);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id, ['itens']);
      expect(estoqueService.findByProdutoIds).toHaveBeenCalledWith(empresaId, [1]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should not return products with insufficient stock', async () => {
      const empresaId = 1;
      const id = 1;
      const romaneio = { itens: [{ produtoId: 1, quantidade: 100 }] };
      const estoque = [{ produtoId: 1, saldo: 100 }];

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio as any);
      jest.spyOn(estoqueService, 'findByProdutoIds').mockResolvedValueOnce(estoque as any);

      const result = await service.validarEstoque(empresaId, id);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id, ['itens']);
      expect(estoqueService.findByProdutoIds).toHaveBeenCalledWith(empresaId, [1]);
      expect(result.length).toBe(0);
    });
  });

  describe('encerrar', () => {
    it('should throw BadRequestException if romaneio is not in EmAndamento state', async () => {
      const empresaId = 1;
      const caixaId = 1;
      const id = 1;
      const romaneio = { situacao: SituacaoRomaneio.encerrado } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);

      await expect(service.encerrar(empresaId, caixaId, id)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
    });

    it('should update romaneio situacao to Encerrado if operacao is Outros', async () => {
      const empresaId = 1;
      const operadorId = 1;
      const caixaId = 1;
      const id = 1;
      const liquidacao = undefined;
      const romaneio = { id: 1, situacao: SituacaoRomaneio.em_andamento, operacao: OperacaoRomaneio.outros } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      await service.encerrar(empresaId, caixaId, id);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { caixaId, situacao: SituacaoRomaneio.encerrado, liquidacao, operadorId },
      );
    });

    it('should update romaneio situacao to Encerrado if operacao is venda', async () => {
      const empresaId = 1;
      const operadorId = 1;
      const caixaId = 1;
      const id = 1;
      const liquidacao = 1692703474445;
      const romaneio = { id: 1, situacao: SituacaoRomaneio.em_andamento, operacao: OperacaoRomaneio.venda } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      await service.encerrar(empresaId, caixaId, id, liquidacao);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { caixaId, situacao: SituacaoRomaneio.encerrado, liquidacao, operadorId },
      );
    });

    it('should update romaneio situacao to Encerrado if operacao is devolucao', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const caixaId = 1;
      const id = 1;
      const liquidacao = 1692703474445;
      const romaneio = {
        id: 1,
        situacao: SituacaoRomaneio.em_andamento,
        operacao: OperacaoRomaneio.venda,
        romaneiosDevolucao: [1],
      } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      await service.encerrar(empresaId, caixaId, id, liquidacao);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { caixaId, situacao: SituacaoRomaneio.encerrado, liquidacao, operadorId },
      );
      expect(repository.query).toHaveBeenCalledWith(`CALL romaneio_calcular_itens_devidos(${id})`);
    });

    it('should update romaneio situacao to Encerrado if operacao is consignacao_saida', async () => {
      const empresaId = 1;
      const operadorId = 1;
      const caixaId = 1;
      const id = 1;
      const liquidacao = undefined;
      const romaneio = {
        id: 1,
        situacao: SituacaoRomaneio.em_andamento,
        operacao: OperacaoRomaneio.consignacao_saida,
        consignacaoId: 1,
      } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      await service.encerrar(empresaId, caixaId, id, liquidacao);

      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { caixaId, situacao: SituacaoRomaneio.encerrado, liquidacao, operadorId },
      );
      expect(consignacaoService.calculate).toHaveBeenCalledTimes(1);
      expect(consignacaoService.calculate).toHaveBeenCalledWith(romaneio.consignacaoId);
    });

    it('should throw BadRequestException if update situacao', async () => {
      const empresaId = 1;
      const operadorId = 1;
      const caixaId = 1;
      const id = 1;
      const liquidacao = undefined;
      const romaneio = { id: 1, situacao: SituacaoRomaneio.em_andamento, operacao: OperacaoRomaneio.outros } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.encerrar(empresaId, caixaId, id)).rejects.toThrow(BadRequestException);
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { caixaId, situacao: SituacaoRomaneio.encerrado, liquidacao, operadorId },
      );
    });
  });

  describe('cancelar', () => {
    it('should throw BadRequestException if cancelar pedido type "transferencia_saida" already received', async () => {
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';
      const romaneio = { pedidoId: 999, operacao: OperacaoRomaneio.transferencia_saida } as any;
      const pedido = { tipo: 'transferencia_saida', romaneioDestinoId: 1 } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.cancelar(empresaId, id, motivo)).rejects.toThrowError(
        'Não é possível cancelar um romaneio de transferência que já foi recebido no destino',
      );
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(pedidoService.findById).toHaveBeenCalledWith(romaneio.pedidoId);
    });

    it('should throw BadRequestException if cancelar fails', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';

      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      await expect(service.cancelar(empresaId, id, motivo)).rejects.toThrow(BadRequestException);
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: SituacaoRomaneio.cancelado, motivoCancelamento: motivo, operadorId },
      );
    });

    it('should cancel a romaneio', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';
      const romaneio = { ...romaneioFakeRepository.findOneView() } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      const result = await service.cancelar(empresaId, id, motivo);

      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: SituacaoRomaneio.cancelado, motivoCancelamento: motivo, operadorId },
      );
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
    });

    it('should cancel a romaneio if operacao is devolucao', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';
      const romaneio = { ...romaneioFakeRepository.findOneView(), romaneiosDevolucao: [1] } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      const result = await service.cancelar(empresaId, id, motivo);

      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: SituacaoRomaneio.cancelado, motivoCancelamento: motivo, operadorId },
      );
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
      expect(repository.query).toBeCalledWith(`CALL romaneio_cancelar_itens_devolvidos(${id})`);
    });

    it('should cancel a romaneio if operacao is consignacao_saida', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';
      const romaneio = { ...romaneioFakeRepository.findOneView(), consignacaoId: 1 } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      const result = await service.cancelar(empresaId, id, motivo);

      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: SituacaoRomaneio.cancelado, motivoCancelamento: motivo, operadorId },
      );
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
      expect(consignacaoService.calculate).toHaveBeenCalledTimes(1);
      expect(consignacaoService.calculate).toHaveBeenCalledWith(romaneio.consignacaoId);
    });

    it('should cancel a romaneio if operacao is transferencia_saida', async () => {
      const operadorId = 1;
      const empresaId = 1;
      const id = 1;
      const motivo = 'Teste';
      const romaneio = { ...romaneioFakeRepository.findOneView(), pedidoId: 999, operacao: 'transferencia_saida' } as any;
      const pedido = { tipo: 'transferencia_saida' } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(romaneio);
      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(repository, 'update').mockResolvedValueOnce({} as any);

      const result = await service.cancelar(empresaId, id, motivo);

      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: SituacaoRomaneio.cancelado, motivoCancelamento: motivo, operadorId },
      );
      expect(service.findById).toHaveBeenCalledWith(empresaId, id);
      expect(result).toEqual(romaneioFakeRepository.findOneView());
      expect(pedidoService.findById).toHaveBeenCalledWith(romaneio.pedidoId);
      expect(pedidoService.cancelarFaturamento).toHaveBeenCalledWith(romaneio.pedidoId);
    });
  });
});
