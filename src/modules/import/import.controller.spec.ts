import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

describe('ImportController', () => {
  let controller: ImportController;
  let service: ImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        {
          provide: ImportService,
          useValue: {
            produtosCSV: jest.fn(),
            referenciasPrecoCsv: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImportController>(ImportController);
    service = module.get<ImportService>(ImportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/produtos/csv (POST)', () => {
    it('should import a list of products from csv', async () => {
      // Arrange
      const files = [{ originalname: 'file.csv' }] as Express.Multer.File[];

      // Act
      await controller.produtosCSV(files);

      // Assert
      expect(service.produtosCSV).toHaveBeenCalledTimes(1);
      expect(service.produtosCSV).toHaveBeenCalledWith(files);
    });
  });

  describe('/referecias/preco/csv (POST)', () => {
    it('should import a list of references prices from csv', async () => {
      // Arrange
      const files = [{ originalname: 'file.csv' }] as Express.Multer.File[];

      // Act
      await controller.referenciasPrecoCsv(files);

      // Assert
      expect(service.referenciasPrecoCsv).toHaveBeenCalledTimes(1);
      expect(service.referenciasPrecoCsv).toHaveBeenCalledWith(files);
    });
  });
});
