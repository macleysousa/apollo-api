import { Test, TestingModule } from '@nestjs/testing';

import { CancelPedidoDto } from './dto/cancel-pedido.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoFilter } from './filters/pedido.filters';
import { PedidoInclude } from './includes/pedido.include';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';

describe('PedidoController', () => {
  let controller: PedidoController;
  let service: PedidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoController],
      providers: [
        {
          provide: PedidoService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            conferir: jest.fn(),
            faturar: jest.fn(),
            cancel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PedidoController>(PedidoController);
    service = module.get<PedidoService>(PedidoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('(POST)', () => {
    it('should create a new pedido', async () => {
      const createPedidoDto = { tipo: 'venda' } as CreatePedidoDto;
      const pedido = { id: 1, ...createPedidoDto } as any;

      jest.spyOn(service, 'create').mockResolvedValueOnce(pedido);

      const result = await controller.create(createPedidoDto);

      expect(result).toEqual(pedido);
      expect(service.create).toHaveBeenCalledWith(createPedidoDto);
    });
  });

  describe('(GET)', () => {
    it('should find all pedidos', async () => {
      const filter = { situacoeso: ['em_andamento'] } as PedidoFilter;
      const pedidos = [{ id: 1, tipo: 'venda' }] as any;

      jest.spyOn(service, 'find').mockResolvedValueOnce(pedidos);

      const result = await controller.find(filter);

      expect(result).toEqual(pedidos);
      expect(service.find).toHaveBeenCalledWith(filter);
    });
  });

  describe(':id (GET)', () => {
    it('should find the pedido with the given id', async () => {
      const id = 1;
      const includes: PedidoInclude[] = ['itens'];
      const pedido = { id, tipo: 'venda' } as any;

      jest.spyOn(service, 'findById').mockResolvedValueOnce(pedido);

      const result = await controller.findById(id, includes);

      expect(result).toEqual(pedido);
      expect(service.findById).toHaveBeenCalledWith(id, includes);
    });
  });

  describe(':id (PUT)', () => {
    it('should update the pedido with the given id', async () => {
      const id = 1;
      const updatePedidoDto = { tipo: 'venda' } as UpdatePedidoDto;
      const pedido = { id, tipo: 'aluguel' };
      const updatedPedido = { ...pedido, ...updatePedidoDto } as any;

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedPedido);

      const result = await controller.update(id, updatePedidoDto);

      expect(result).toEqual(updatedPedido);
      expect(service.update).toHaveBeenCalledWith(id, updatePedidoDto);
    });
  });

  describe(':id/conferir (PUT)', () => {
    it('should conferir the pedido with the given id', async () => {
      const id = 1;
      const processarComDivegencia = true;

      jest.spyOn(service, 'conferir').mockResolvedValueOnce(undefined);

      await controller.conferir(id, processarComDivegencia);

      expect(service.conferir).toHaveBeenCalledWith(id, processarComDivegencia);
    });
  });

  describe(':id/faturar (PUT)', () => {
    it('should faturar the pedido with the given id', async () => {
      const id = 1;

      jest.spyOn(service, 'faturar').mockResolvedValueOnce(undefined);

      await controller.faturar(id);

      expect(service.faturar).toHaveBeenCalledWith(id);
    });
  });

  describe(':id/cancelar (PUT)', () => {
    it('should cancel the pedido with the given id', async () => {
      const id = 1;
      const cancelPedidoDto = { motivoCancelamento: 'Produto indisponível' } as CancelPedidoDto;

      jest.spyOn(service, 'cancel').mockResolvedValueOnce(undefined);

      await controller.cancel(id, cancelPedidoDto);

      expect(service.cancel).toHaveBeenCalledWith(id, cancelPedidoDto);
    });
  });
});
