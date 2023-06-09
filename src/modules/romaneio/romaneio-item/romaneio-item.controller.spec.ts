import { Test, TestingModule } from '@nestjs/testing';

import { RomaneioItemController } from './romaneio-item.controller';
import { RomaneioItemService } from './romaneio-item.service';

describe('RomaneioItemController', () => {
  let controller: RomaneioItemController;
  let service: RomaneioItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RomaneioItemController],
      providers: [
        {
          provide: RomaneioItemService,
          useValue: {},
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
});
