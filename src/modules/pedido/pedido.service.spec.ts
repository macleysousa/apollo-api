import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { CancelPedidoDto } from './dto/cancel-pedido.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoEntity } from './entities/pedido.entity';
import { PedidoFilter } from './filters/pedido.filters';
import { PedidoService } from './pedido.service';
import { RomaneioService } from '../romaneio/romaneio.service';
import { EstoqueService } from '../estoque/estoque.service';
import { EstoqueView } from '../estoque/views/estoque.view';

describe('PedidoService', () => {
  let service: PedidoService;
  let repository: Repository<PedidoEntity>;
  let contextService: ContextService;
  let estoqueService: EstoqueService;
  let romaneioService: RomaneioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        {
          provide: getRepositoryToken(PedidoEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            query: jest.fn(),
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
            empresaId: jest.fn().mockReturnValue(1),
            operadorId: jest.fn().mockReturnValue(1),
            parametros: jest.fn().mockReturnValue([]),
          },
        },
        {
          provide: EstoqueService,
          useValue: {
            findByProdutoIds: jest.fn(),
          },
        },
        {
          provide: RomaneioService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
    repository = module.get<Repository<PedidoEntity>>(getRepositoryToken(PedidoEntity));
    contextService = module.get<ContextService>(ContextService);
    estoqueService = module.get<EstoqueService>(EstoqueService);
    romaneioService = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
    expect(estoqueService).toBeDefined();
    expect(romaneioService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pedido compra', async () => {
      const empresaId = 1;
      const operadorId = 1;

      const dto = { tipo: 'compra' } as CreatePedidoDto;
      const resultado = { ...dto, id: 1 } as PedidoEntity;

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as PedidoEntity);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(resultado);

      const pedido = await service.create(dto);

      expect(repository.save).toHaveBeenCalledWith({
        ...dto,
        empresaId,
        situacao: 'em_andamento',
        financeiro: true,
        operadorId,
      });
      expect(pedido).toEqual(resultado);
    });

    it('should create a new pedido venda', async () => {
      const empresaId = 1;
      const operadorId = 1;

      const dto = { tipo: 'venda' } as CreatePedidoDto;
      const resultado = { ...dto, id: 1 } as PedidoEntity;

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as PedidoEntity);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(resultado);

      const pedido = await service.create(dto);

      expect(repository.save).toHaveBeenCalledWith({
        ...dto,
        empresaId,
        situacao: 'em_andamento',
        financeiro: true,
        operadorId,
      });
      expect(pedido).toEqual(resultado);
    });

    it('should create a new pedido transferencia_saida', async () => {
      const empresaId = 1;
      const operadorId = 1;

      const dto = { tipo: 'transferencia_saida' } as CreatePedidoDto;
      const resultado = { ...dto, id: 1 } as PedidoEntity;

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as PedidoEntity);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(resultado);

      const pedido = await service.create(dto);

      expect(repository.save).toHaveBeenCalledWith({
        ...dto,
        empresaId,
        situacao: 'em_andamento',
        financeiro: false,
        operadorId,
      });
      expect(pedido).toEqual(resultado);
    });

    it('should create a new pedido transferencia_entrada', async () => {
      const empresaId = 1;
      const operadorId = 1;

      const dto = { tipo: 'transferencia_entrada' } as CreatePedidoDto;
      const resultado = { ...dto, id: 1 } as PedidoEntity;

      jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1 } as PedidoEntity);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(resultado);

      const pedido = await service.create(dto);

      expect(repository.save).toHaveBeenCalledWith({
        ...dto,
        empresaId,
        situacao: 'em_andamento',
        financeiro: false,
        operadorId,
      });
      expect(pedido).toEqual(resultado);
    });
  });

  describe('find', () => {
    it('should return all pedidos if no filter is provided', async () => {
      const filter = undefined;
      const pedidos = [{ id: 1 }, { id: 2 }] as PedidoEntity[];

      jest.spyOn(repository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(pedidos);

      const result = await service.find(filter);

      expect(result).toEqual(pedidos);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('p.empresaId IS NOT NULL');
      expect(repository.createQueryBuilder().andWhere).not.toHaveBeenCalled();
    });

    it('should return filtered pedidos', async () => {
      const filter: PedidoFilter = {
        empresaIds: [1],
        pessoaIds: [2],
        funcionarioIds: [3],
        tipos: ['venda'],
        situacoes: ['em_andamento'],
      };
      const pedidos = [{ id: 1 }, { id: 2 }] as PedidoEntity[];

      jest.spyOn(repository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(pedidos);

      const result = await service.find(filter);

      expect(result).toEqual(pedidos);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('p');
      expect(repository.createQueryBuilder().where).toHaveBeenCalledWith('p.empresaId IS NOT NULL');
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.empresaId IN (:...empresaIds)', {
        empresaIds: filter.empresaIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.pessoaId IN (:...pessoaIds)', {
        pessoaIds: filter.pessoaIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.funcionarioId IN (:...funcionarioIds)', {
        funcionarioIds: filter.funcionarioIds,
      });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.tipo IN (:...tipos)', { tipos: filter.tipos });
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalledWith('e.situacao IN (:...situacoes)', {
        situacoes: filter.situacoes,
      });
    });
  });

  describe('findById', () => {
    it('should return the pedido with the given id', async () => {
      const id = 1;
      const pedido = { id } as PedidoEntity;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pedido);

      const result = await service.findById(id);

      expect(result).toEqual(pedido);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if pedido is not in "em_andamento" status', async () => {
      const id = 1;
      const dto: UpdatePedidoDto = { funcionarioId: 2 };
      const pedido = { id, situacao: 'cancelado' } as PedidoEntity;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.update(id, dto)).rejects.toThrowError('Não é possível alterar um pedido que não esteja em andamento');

      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should update the pedido with the given id', async () => {
      const id = 1;
      const dto: UpdatePedidoDto = { funcionarioId: 2 };
      const operadorId = 1;
      const pedido = { id, situacao: 'em_andamento' } as PedidoEntity;
      const updatedPedido = { ...pedido, ...dto, operadorId };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(contextService, 'operadorId').mockReturnValueOnce(operadorId);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'findById').mockResolvedValueOnce(updatedPedido);

      const result = await service.update(id, dto);

      expect(result).toEqual(updatedPedido);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(contextService.operadorId).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith({ id }, { ...dto, operadorId });
      expect(service.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('conferir', () => {
    it('should throw BadRequestException if pedido is not in "em_andamento" status', async () => {
      const id = 1;
      const pedido = { id, situacao: 'cancelado' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.conferir(id)).rejects.toThrowError('Não é possível conferir um pedido que não esteja em andamento');

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
    });

    it('should throw BadRequestException if pedido is in "em_andamento" status and there are divergencias', async () => {
      const id = 1;
      const pedido = { id, situacao: 'em_andamento', itens: [{ solicitado: 2, atendido: 1 }] } as unknown as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.conferir(id)).rejects.toThrowError(
        'Foi encontrado uma divergência entre a quantidade solicitada e a quantidade atendida'
      );

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
    });

    it('should conferir the pedido with the given id', async () => {
      const id = 1;
      const operadorId = 1;
      const pedido = { id, situacao: 'em_andamento', itens: [{ solicitado: 2, atendido: 2 }] } as unknown as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(contextService, 'operadorId').mockReturnValueOnce(operadorId);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await service.conferir(id);

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
      expect(repository.update).toHaveBeenCalledWith({ id }, { situacao: 'conferido', operadorId });
    });
  });

  describe('cancelarConferencia', () => {
    it('should throw BadRequestException if pedido is not in "conferido" status', async () => {
      const id = 1;
      const pedido = { id, situacao: 'cancelado' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.cancelarConferencia(id)).rejects.toThrowError(
        'Não é possível cancelar a conferência de um pedido que não esteja situação "conferido"'
      );

      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should cancelarConferencia the pedido with the given id', async () => {
      const id = 1;
      const operadorId = 1;
      const pedido = { id, situacao: 'conferido' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(contextService, 'operadorId').mockReturnValueOnce(operadorId);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      await service.cancelarConferencia(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(contextService.operadorId).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith({ ...pedido, situacao: 'em_andamento', operadorId });
    });
  });

  describe('faturar', () => {
    it('should throw BadRequestException if pedido is in "faturado" status', async () => {
      const id = 1;
      const pedido = { id, situacao: 'encerrado' } as PedidoEntity;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.faturar(id)).rejects.toThrowError('Não é possível faturar um pedido que já foi encerrado');

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
    });

    it('should throw BadRequestException if pedido is in "cancelado" status', async () => {
      const id = 1;
      const pedido = { id, situacao: 'cancelado' } as PedidoEntity;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.faturar(id)).rejects.toThrowError('Não é possível faturar um pedido que já foi cancelado');

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
    });

    it('should throw BadRequestException if pedido is in "em_andamento" status', async () => {
      const id = 1;
      const pedido = { id, situacao: 'em_andamento' } as PedidoEntity;
      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(contextService, 'parametros').mockReturnValueOnce([{ parametroId: 'FATURAR_PEDIDO_SEM_CONFERENCIA', valor: 'N' }] as any);

      await expect(service.faturar(id)).rejects.toThrowError('Não é possível faturar um pedido que não esteja conferido');

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
    });

    it('should throw BadRequestException if pedido type "venda" products with balance insufficient', async () => {
      const id = 1;
      const pedido = { id, tipo: 'venda', situacao: 'conferido', itens: [{ produtoId: 1, solicitado: 2, atendido: 2 }] } as PedidoEntity;
      const estoque = [{ produtoId: 1, saldo: 1 }] as EstoqueView[];

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(estoqueService, 'findByProdutoIds').mockResolvedValueOnce(estoque);

      await expect(service.faturar(id)).rejects.toThrowError(
        `Não há saldo suficiente para os produtos: ${estoque.map((e) => e.produtoId).join(', ')}`
      );
      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
      expect(estoqueService.findByProdutoIds).toHaveBeenCalledWith(1, [1]);
    });

    it('should throw BadRequestException if pedido type "transferencia_saida" products with balance insufficient', async () => {
      const id = 1;
      const pedido = {
        id,
        tipo: 'transferencia_saida',
        situacao: 'conferido',
        itens: [{ produtoId: 1, solicitado: 2, atendido: 2 }],
      } as PedidoEntity;
      const estoque = [{ produtoId: 1, saldo: 1 }] as EstoqueView[];

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(estoqueService, 'findByProdutoIds').mockResolvedValueOnce(estoque);

      await expect(service.faturar(id)).rejects.toThrowError(
        `Não há saldo suficiente para os produtos: ${estoque.map((e) => e.produtoId).join(', ')}`
      );
      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
      expect(estoqueService.findByProdutoIds).toHaveBeenCalledWith(1, [1]);
    });

    it('should faturar the pedido type "transferencia_saida"', async () => {
      const id = 1;
      const operadorId = 1;
      const pedido = new PedidoEntity({
        id,
        pessoaId: 10,
        tabelaPrecoId: 3,
        tipo: 'transferencia_saida',
        situacao: 'conferido',
        itens: [{ produtoId: 1, solicitado: 2, atendido: 2 }] as any,
      });
      const estoque = [{ produtoId: 1, saldo: 2 }] as EstoqueView[];
      const romaneio = { romaneioId: 999 } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(estoqueService, 'findByProdutoIds').mockResolvedValueOnce(estoque);
      jest.spyOn(romaneioService, 'create').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'query').mockResolvedValueOnce(undefined);

      await service.faturar(id);

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
      expect(estoqueService.findByProdutoIds).toHaveBeenCalled();
      expect(romaneioService.create).toHaveBeenCalledWith({
        pessoaId: pedido.pessoaId,
        tabelaPrecoId: pedido.tabelaPrecoId,
        funcionarioId: operadorId,
        operacao: pedido.tipo,
        pedidoId: pedido.id,
      });
      expect(repository.query).toHaveBeenCalledWith(
        `
insert into romaneios_itens (empresaId, romaneioId, data, sequencia, referenciaId, produtoId, quantidade, valorUnitario, valorUnitDesconto, operadorId)
(select i.empresaId, ${romaneio.romaneioId}, e.data, i.sequencia, p.referenciaId, i.produtoId, i.atendido, i.valorUnitario, i.valorUnitDesconto, i.operadorId
from pedidos_itens i
inner join empresas e on e.id = i.empresaId
inner join produtos p on p.id = i.produtoId
where i.pedidoId = ${id} and i.atendido > 0)
      `
      );
      expect(repository.save).toHaveBeenCalledWith({ ...pedido, situacao: 'encerrado', operadorId });
    });

    it('should faturar the pedido type "transferencia_entrada"', async () => {
      const id = 1;
      const operadorId = 1;
      const pedido = new PedidoEntity({
        id,
        pessoaId: 10,
        tabelaPrecoId: 3,
        tipo: 'transferencia_entrada',
        situacao: 'conferido',
        itens: [{ produtoId: 1, solicitado: 2, atendido: 2 }] as any,
      });
      const romaneio = { romaneioId: 999 } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(romaneioService, 'create').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'query').mockResolvedValueOnce(undefined);

      await service.faturar(id);

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
      expect(estoqueService.findByProdutoIds).not.toHaveBeenCalled();
      expect(romaneioService.create).toHaveBeenCalledWith({
        pessoaId: pedido.pessoaId,
        tabelaPrecoId: pedido.tabelaPrecoId,
        funcionarioId: operadorId,
        operacao: pedido.tipo,
        pedidoId: pedido.id,
      });
      expect(repository.query).toHaveBeenCalledWith(
        `
insert into romaneios_itens (empresaId, romaneioId, data, sequencia, referenciaId, produtoId, quantidade, valorUnitario, valorUnitDesconto, operadorId)
(select i.empresaId, ${romaneio.romaneioId}, e.data, i.sequencia, p.referenciaId, i.produtoId, i.atendido, i.valorUnitario, i.valorUnitDesconto, i.operadorId
from pedidos_itens i
inner join empresas e on e.id = i.empresaId
inner join produtos p on p.id = i.produtoId
where i.pedidoId = ${id} and i.atendido > 0)
      `
      );
      expect(repository.save).toHaveBeenCalledWith({ ...pedido, situacao: 'encerrado', operadorId });
    });

    it('should faturar the pedido', async () => {
      const id = 1;
      const operadorId = 1;
      const pedido = new PedidoEntity({ id, pessoaId: 10, tabelaPrecoId: 3, tipo: 'compra', situacao: 'conferido' });
      const romaneio = { romaneioId: 999 } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(romaneioService, 'create').mockResolvedValueOnce(romaneio);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'query').mockResolvedValueOnce(undefined);

      await service.faturar(id);

      expect(service.findById).toHaveBeenCalledWith(id, ['itens']);
      expect(romaneioService.create).toHaveBeenCalledWith({
        pessoaId: pedido.pessoaId,
        tabelaPrecoId: pedido.tabelaPrecoId,
        funcionarioId: operadorId,
        operacao: pedido.tipo,
        pedidoId: pedido.id,
      });
      expect(repository.query).toHaveBeenCalledWith(
        `
insert into romaneios_itens (empresaId, romaneioId, data, sequencia, referenciaId, produtoId, quantidade, valorUnitario, valorUnitDesconto, operadorId)
(select i.empresaId, ${romaneio.romaneioId}, e.data, i.sequencia, p.referenciaId, i.produtoId, i.atendido, i.valorUnitario, i.valorUnitDesconto, i.operadorId
from pedidos_itens i
inner join empresas e on e.id = i.empresaId
inner join produtos p on p.id = i.produtoId
where i.pedidoId = ${id} and i.atendido > 0)
      `
      );
      expect(repository.save).toHaveBeenCalledWith({ ...pedido, situacao: 'encerrado', operadorId });
    });
  });

  describe('cancelarFaturamento', () => {
    it('should throw BadRequestException if pedido is not in "encerrado" status', async () => {
      const id = 1;
      const pedido = { id, situacao: 'cancelado' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.cancelarFaturamento(id)).rejects.toThrowError(
        'Não é possível cancelar o faturamento de um pedido que não esteja encerrado'
      );

      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException if pedido type "transferencia_saida" already received at destination', async () => {
      const id = 1;
      const pedido = { id, situacao: 'encerrado', tipo: 'transferencia_saida', romaneioOrigemId: 55 } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.cancelarFaturamento(id)).rejects.toThrowError(
        'Não é possível cancelar o faturamento de um pedido que já foi recebido no destino'
      );

      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should cancelarFaturamento the pedido type "transferencia_saida"', async () => {
      const id = 1;
      const operadorId = 1;
      const pedido = { id, situacao: 'encerrado', tipo: 'transferencia_saida' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      await service.cancelarFaturamento(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.save).toHaveBeenCalledWith({ ...pedido, situacao: 'conferido', operadorId });
    });

    it('should cancelarFaturamento the pedido type "transferencia_entrada"', async () => {
      const id = 1;
      const operadorId = 1;
      const pedido = { id, situacao: 'encerrado', tipo: 'transferencia_entrada' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      await service.cancelarFaturamento(id);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(repository.save).toHaveBeenCalledWith({ ...pedido, situacao: 'conferido', operadorId });
    });
  });

  describe('cancel', () => {
    it('should throw BadRequestException if pedido is not in "em_andamento" status', async () => {
      const id = 1;
      const dto: CancelPedidoDto = { motivoCancelamento: 'Produto indisponível' };
      const pedido = { id, situacao: 'encerrado' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.cancel(id, dto)).rejects.toThrowError('Não é possível cancelar um pedido que está com situação "encerrado"');

      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should cancel the pedido with the given id', async () => {
      const id = 1;
      const dto: CancelPedidoDto = { motivoCancelamento: 'Produto indisponível' };
      const operadorId = 1;
      const pedido = { id, situacao: 'em_andamento' } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(contextService, 'operadorId').mockReturnValueOnce(operadorId);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await service.cancel(id, dto);

      expect(service.findById).toHaveBeenCalledWith(id);
      expect(contextService.operadorId).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalledWith(
        { id },
        { situacao: 'cancelado', motivoCancelamento: dto.motivoCancelamento, operadorId }
      );
    });
  });
});
