import { Test, TestingModule } from '@nestjs/testing';
import { romaneioFakeRepository } from 'src/base-fake/romaneio';

import { RomaneioItemController } from './romaneio-item.controller';
import { RomaneioItemService } from './romaneio-item.service';
import { UpSertRemoveRomaneioItemDto } from './dto/add-remove-romaneio-item.dto';
import { RomaneioService } from '../romaneio.service';

describe('RomaneioItemController', () => {
  let controller: RomaneioItemController;
  let service: RomaneioItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RomaneioItemController],
      providers: [
        {
          provide: RomaneioItemService,
          useValue: {
            add: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneViewItem()),
            find: jest.fn().mockResolvedValue(romaneioFakeRepository.findViewItens()),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RomaneioService,
          useValue: {
            findById: jest.fn().mockResolvedValue(romaneioFakeRepository.findOneView()),
          },
        },
      ],
    }).compile();

    controller = module.get<RomaneioItemController>(RomaneioItemController);
    service = module.get<RomaneioItemService>(RomaneioItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should call service add method with correct parameters', async () => {
      const romaneioId = 1;
      const addDto = { produtoId: 2, quantidade: 3 } as UpSertRemoveRomaneioItemDto;
      const romaneioItemView = romaneioFakeRepository.findOneViewItem();

      const result = await controller.add(romaneioId, addDto);

      expect(service.add).toHaveBeenCalledWith(romaneioId, addDto);
      expect(result).toEqual(romaneioItemView);
    });
  });

  describe('find', () => {
    it('should call service find method with correct parameters', async () => {
      const romaneioId = 1;
      const romaneioItemViews = romaneioFakeRepository.findViewItens();

      const result = await controller.find(romaneioId);

      expect(service.find).toHaveBeenCalledWith(romaneioId);
      expect(result).toEqual(romaneioItemViews);
    });
  });

  describe('remove', () => {
    it('should call service remove method with correct parameters', async () => {
      const romaneioId = 1;
      const removeDto = { produtoId: 2, quantidade: 3 } as UpSertRemoveRomaneioItemDto;

      await controller.remove(romaneioId, removeDto);

      expect(service.remove).toHaveBeenCalledWith(romaneioId, removeDto.produtoId, removeDto.quantidade);
    });
  });
});
