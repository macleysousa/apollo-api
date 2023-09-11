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

describe('PedidoService', () => {
  let service: PedidoService;
  let repository: Repository<PedidoEntity>;
  let contextService: ContextService;
  let estoqueService: EstoqueService;
  let romanerioService: RomaneioService;

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
    romanerioService = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
    expect(estoqueService).toBeDefined();
    expect(romanerioService).toBeDefined();
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

    it('should create a new pedido transferencia', async () => {
      const empresaId = 1;
      const operadorId = 1;

      const dto = { tipo: 'transferencia' } as CreatePedidoDto;
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

  describe('cancel', () => {
    it('should throw BadRequestException if pedido is not in "em_andamento" status', async () => {
      const id = 1;
      const dto: CancelPedidoDto = { motivoCancelamento: 'Produto indisponível' };
      const pedido = { id, romaneioDestinoId: 2 } as PedidoEntity;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.cancel(id, dto)).rejects.toThrowError('Não é possível cancelar um pedido que já foi transferido');

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
