import { Test, TestingModule } from '@nestjs/testing';

import { CodigoBarrasController } from './codigo-barras.controller';
import { CodigoBarrasService } from './codigo-barras.service';
import { CreateCodigoBarrasDto } from './dto/create-codigo-barras.dto';

describe('BarcodeController', () => {
  let controller: CodigoBarrasController;
  let service: CodigoBarrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodigoBarrasController],
      providers: [
        {
          provide: CodigoBarrasService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CodigoBarrasController>(CodigoBarrasController);
    service = module.get<CodigoBarrasService>(CodigoBarrasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a barcode', async () => {
      // Arrange
      const productId = 1;
      const barcode: CreateCodigoBarrasDto = { tipo: 'EAN13', codigo: '123456' };

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
