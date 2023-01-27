import { Test, TestingModule } from '@nestjs/testing';

import { BarcodeController } from './barcode.controller';
import { BarcodeService } from './barcode.service';
import { CreateBarcodeDto } from './dto/create-barcode.dto';

describe('BarcodeController', () => {
  let controller: BarcodeController;
  let service: BarcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarcodeController],
      providers: [
        {
          provide: BarcodeService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
          },
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

  describe('/ (POST)', () => {
    it('should create a barcode', async () => {
      // Arrange
      const productId = 1;
      const barcode: CreateBarcodeDto = { barcode: '123456' };

      // Act
      await controller.create(productId, barcode);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(productId, barcode);
    });
  });

  describe('/:barcode (DELETE)', () => {
    it('should delete a barcode', async () => {
      // Arrange
      const productId = 1;
      const barcode = '123456';

      // Act
      await controller.remove(productId, barcode);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(productId, barcode);
    });
  });
});
