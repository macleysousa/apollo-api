import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PedidoItemEntity } from './entities/pedido-item.entity';
import { PedidoItemService } from './pedido-item.service';
import { Repository } from 'typeorm';
import { PedidoService } from '../pedido.service';
import { ProdutoService } from 'src/modules/produto/produto.service';
import { ContextService } from 'src/context/context.service';
import { AddPedidoItemDto } from './dto/add-pedido-item.dto';
import { RemovePedidoItemDto } from './dto/remove-pedido-item.dto';
import { BadRequestException } from '@nestjs/common';
import { ConferirPedidoItemDto } from './dto/conferir-pedido-item.dto';

describe('PedidoItemService', () => {
  let service: PedidoItemService;
  let repository: Repository<PedidoItemEntity>;
  let pedidoService: PedidoService;
  let productService: ProdutoService;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoItemService,
        {
          provide: getRepositoryToken(PedidoItemEntity),
          useValue: {
            insert: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getRawOne: jest.fn(),
              getMany: jest.fn(),
            }),
          },
        },
        {
          provide: PedidoService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ProdutoService,
          useValue: {
            findProductWithPrice: jest.fn(),
          },
        },
        {
          provide: ContextService,
          useValue: {
            operadorId: jest.fn().mockReturnValue(1),
            empresaId: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<PedidoItemService>(PedidoItemService);
    repository = module.get<Repository<PedidoItemEntity>>(getRepositoryToken(PedidoItemEntity));
    pedidoService = module.get<PedidoService>(PedidoService);
    productService = module.get<ProdutoService>(ProdutoService);
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(pedidoService).toBeDefined();
    expect(productService).toBeDefined();
    expect(contextService).toBeDefined();
  });

  describe('add', () => {
    it('should throw BadRequestException if the pedido with the given id is not found', async () => {
      const pedidoId = 1;
      const addPedidoItemDto: AddPedidoItemDto = { produtoId: 1, quantidade: 2 };

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.add(pedidoId, addPedidoItemDto)).rejects.toThrowError('Pedido não encontrado');

      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
    });

    it('should throw BadRequestException if the pedido with the given id is not in progress', async () => {
      const pedidoId = 1;
      const addPedidoItemDto: AddPedidoItemDto = { produtoId: 1, quantidade: 2 };
      const pedido = { id: pedidoId, situacao: 'cancelado', tabelaPrecoId: 1 } as any;

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.add(pedidoId, addPedidoItemDto)).rejects.toThrowError('Pedido não está em andamento');

      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
    });

    it('should add a new item to the pedido with the given id', async () => {
      const pedidoId = 1;
      const addPedidoItemDto: AddPedidoItemDto = { produtoId: 1, quantidade: 2 };
      const pedido = { id: pedidoId, situacao: 'em_andamento', tabelaPrecoId: 1 } as any;
      const { valor } = { valor: 10 };
      const pedidoItem = { pedidoId: 1, produtoId: 1, sequencia: 1, solicitado: 2, valorUnitario: valor } as PedidoItemEntity;

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(productService, 'findProductWithPrice').mockResolvedValueOnce({ valor } as any);
      jest.spyOn(repository.createQueryBuilder(), 'getRawOne').mockResolvedValueOnce({ sequencia: 1 });
      jest.spyOn(repository, 'insert').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pedidoItem);

      const result = await service.add(pedidoId, addPedidoItemDto);

      expect(result).toEqual(pedidoItem);
      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
      expect(productService.findProductWithPrice).toHaveBeenCalledWith(addPedidoItemDto.produtoId, pedido.tabelaPrecoId);
      expect(repository.insert).toHaveBeenCalledWith({
        ...addPedidoItemDto,
        sequencia: 1,
        pedidoId,
        operadorId: 1,
        empresaId: 1,
        valorUnitario: valor,
      });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { pedidoId, produtoId: addPedidoItemDto.produtoId, sequencia: 1 } });
    });
  });

  describe('findByPedidoId', () => {
    it('should return all items from the pedido with the given id', async () => {
      const pedidoId = 1;
      const pedidoItems = [{ id: 1 }, { id: 2 }] as any;

      jest.spyOn(repository, 'find').mockResolvedValueOnce(pedidoItems);

      const result = await service.findByPedidoId(pedidoId);

      expect(result).toEqual(pedidoItems);
      expect(repository.find).toHaveBeenCalledWith({ where: { pedidoId } });
    });
  });

  describe('findByProdutoId', () => {
    it('should return all items from the pedido with the given id and produtoId', async () => {
      const pedidoId = 1;
      const produtoId = 1;
      const pedidoItems = [{ id: 1 }, { id: 2 }] as any;

      jest.spyOn(repository, 'find').mockResolvedValueOnce(pedidoItems);

      const result = await service.findByProdutoId(pedidoId, produtoId);

      expect(result).toEqual(pedidoItems);
      expect(repository.find).toHaveBeenCalledWith({ where: { pedidoId, produtoId } });
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if the pedido with the given id is not found', async () => {
      const pedidoId = 1;
      const removePedidoItemDto: RemovePedidoItemDto = { produtoId: 1, sequencia: 1, quantidade: 1 };

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.remove(pedidoId, removePedidoItemDto)).rejects.toThrow(BadRequestException);

      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
    });

    it('should throw BadRequestException if the pedido with the given id is not in progress', async () => {
      const pedidoId = 1;
      const removePedidoItemDto: RemovePedidoItemDto = { produtoId: 1, sequencia: 1, quantidade: 1 };
      const pedido = { id: pedidoId, situacao: 'cancelado' } as any;

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);

      await expect(service.remove(pedidoId, removePedidoItemDto)).rejects.toThrow(BadRequestException);

      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
    });

    it('should throw BadRequestException if the item with the given id does not belong to the pedido with the given id', async () => {
      const pedidoId = 1;
      const removePedidoItemDto: RemovePedidoItemDto = { produtoId: 1, sequencia: 1, quantidade: 1 };
      const pedido = { id: pedidoId, situacao: 'em_andamento' } as any;

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.remove(pedidoId, removePedidoItemDto)).rejects.toThrow(BadRequestException);

      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { pedidoId, produtoId: removePedidoItemDto.produtoId, sequencia: removePedidoItemDto.sequencia },
      });
    });

    it('should remove the item with the given id from the pedido with the given id', async () => {
      const pedidoId = 1;
      const removePedidoItemDto: RemovePedidoItemDto = { produtoId: 1, sequencia: 1, quantidade: 2 };
      const pedido = { id: pedidoId, situacao: 'em_andamento' } as any;
      const item = { id: 1, produtoId: removePedidoItemDto.produtoId, sequencia: removePedidoItemDto.sequencia, solicitado: 2 } as any;

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(item);
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined);

      await service.remove(pedidoId, removePedidoItemDto);

      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { pedidoId, produtoId: removePedidoItemDto.produtoId, sequencia: removePedidoItemDto.sequencia },
      });
      expect(repository.delete).toHaveBeenCalledWith({
        pedidoId,
        produtoId: removePedidoItemDto.produtoId,
        sequencia: removePedidoItemDto.sequencia,
      });
    });

    it('should update the item with the given id from the pedido with the given id', async () => {
      const pedidoId = 1;
      const operadorId = 1;
      const removePedidoItemDto: RemovePedidoItemDto = { produtoId: 1, sequencia: 1, quantidade: 1 };
      const pedido = { id: pedidoId, situacao: 'em_andamento' } as any;
      const item = { produtoId: removePedidoItemDto.produtoId, sequencia: removePedidoItemDto.sequencia, solicitado: 2 } as any;

      jest.spyOn(pedidoService, 'findById').mockResolvedValueOnce(pedido);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(item);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);

      await service.remove(pedidoId, removePedidoItemDto);

      expect(pedidoService.findById).toHaveBeenCalledWith(pedidoId);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { pedidoId, produtoId: removePedidoItemDto.produtoId, sequencia: removePedidoItemDto.sequencia },
      });
      expect(repository.update).toHaveBeenCalledWith(
        { pedidoId, produtoId: removePedidoItemDto.produtoId, sequencia: removePedidoItemDto.sequencia },
        { solicitado: item.solicitado - removePedidoItemDto.quantidade, operadorId }
      );
    });
  });

  describe('conferirItens', () => {
    it('should throw BadRequestException if one or more items are not found in the pedido', async () => {
      const pedidoId = 1;
      const conferirPedidoItemDto: ConferirPedidoItemDto[] = [{ produtoId: 1, sequencia: 1, quantidade: 1 }];
      const itens = [];

      jest.spyOn(service, 'findByPedidoId').mockResolvedValueOnce(itens);

      await expect(service.conferirItens(pedidoId, conferirPedidoItemDto)).rejects.toThrowError(
        'Um ou mais itens não foi encontrado no pedido'
      );
      expect(service.findByPedidoId).toHaveBeenCalledWith(pedidoId);
    });

    it('should update the items with the given ids from the pedido with the given id', async () => {
      const pedidoId = 1;
      const dto: ConferirPedidoItemDto[] = [{ produtoId: 1, sequencia: 1, quantidade: 1 }];
      const itens = [{ id: 1, produtoId: dto[0].produtoId, sequencia: dto[0].sequencia, atendido: 0 }] as any;

      jest.spyOn(service, 'findByPedidoId').mockResolvedValueOnce(itens);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(undefined);

      await service.conferirItens(pedidoId, dto);

      expect(service.findByPedidoId).toHaveBeenCalledWith(pedidoId);
      expect(repository.save).toHaveBeenCalledWith([
        { ...itens[0], atendido: itens[0].atendido + dto[0].quantidade, operadorId: expect.any(Number) },
      ]);
    });
  });
});
