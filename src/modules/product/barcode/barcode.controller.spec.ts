import { Test, TestingModule } from '@nestjs/testing';

import { BarcodeController } from './barcode.controller';
import { BarcodeService } from './barcode.service';

describe('BarcodeController', () => {
  let controller: BarcodeController;
  let service: BarcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarcodeController],
      providers: [
        {
          provide: BarcodeService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BarcodeController>(BarcodeController);
    service = module.get<BarcodeService>(BarcodeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
