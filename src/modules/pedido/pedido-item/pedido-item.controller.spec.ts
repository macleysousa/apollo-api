import { Test, TestingModule } from '@nestjs/testing';

import { PedidoItemController } from './pedido-item.controller';
import { PedidoItemService } from './pedido-item.service';
import { AddPedidoItemDto } from './dto/add-pedido-item.dto';
import { PedidoItemEntity } from './entities/pedido-item.entity';
import { RemovePedidoItemDto } from './dto/remove-pedido-item.dto';

describe('PedidoItemController', () => {
  let controller: PedidoItemController;
  let service: PedidoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoItemController],
      providers: [
        {
          provide: PedidoItemService,
          useValue: {
            add: jest.fn(),
            findByPedidoId: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PedidoItemController>(PedidoItemController);
    service = module.get<PedidoItemService>(PedidoItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe(':id (GET)', () => {
    it('should find all items of the pedido with the given id', async () => {
      const id = 1;
      const pedidoItems = [{ pedidoId: 1, produtoId: 1, sequencia: 1, solicitado: 2 }] as PedidoItemEntity[];

      jest.spyOn(service, 'findByPedidoId').mockResolvedValueOnce(pedidoItems);

      const result = await controller.findByPedidoId(id);

      expect(result).toEqual(pedidoItems);
      expect(service.findByPedidoId).toHaveBeenCalledWith(id);
    });
  });

  describe(':id/adicionar (POST)', () => {
    it('should add a new item to the pedido with the given id', async () => {
      const id = 1;
      const addPedidoItemDto: AddPedidoItemDto = { produtoId: 1, quantidade: 2 };
      const pedidoItem = { pedidoId: 1, produtoId: 1, sequencia: 1, solicitado: 2 } as PedidoItemEntity;

      jest.spyOn(service, 'add').mockResolvedValueOnce(pedidoItem);

      const result = await controller.add(id, addPedidoItemDto);

      expect(result).toEqual(pedidoItem);
      expect(service.add).toHaveBeenCalledWith(id, addPedidoItemDto);
    });
  });

  describe(':id/remover (PUT)', () => {
    it('should remove the item with the given id from the pedido with the given id', async () => {
      const id = 1;
      const removePedidoItemDto: RemovePedidoItemDto = { produtoId: 1, sequencia: 1, quantidade: 1 };

      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      await controller.remove(id, removePedidoItemDto);

      expect(service.remove).toHaveBeenCalledWith(id, removePedidoItemDto);
    });
  });
});
