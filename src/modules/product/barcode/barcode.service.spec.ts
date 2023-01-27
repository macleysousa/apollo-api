import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BarcodeService } from './barcode.service';
import { CreateBarcodeDto } from './dto/create-barcode.dto';
import { BarcodeEntity } from './entities/barcode.entity';

describe('BarcodeService', () => {
  let service: BarcodeService;
  let repository: Repository<BarcodeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarcodeService,
        {
          provide: getRepositoryToken(BarcodeEntity),
          useValue: {
            upsert: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BarcodeService>(BarcodeService);
    repository = module.get<Repository<BarcodeEntity>>(getRepositoryToken(BarcodeEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a barcode', async () => {
      // Arrange
      const productId = 1;
      const create: CreateBarcodeDto = { barcode: '123' };

      // Act
      await service.create(productId, create);

      // Assert
      expect(repository.upsert).toHaveBeenCalledTimes(1);
      expect(repository.upsert).toHaveBeenCalledWith({ productId, code: create.barcode }, { conflictPaths: ['productId', 'code'] });
    });
  });

  describe('remove', () => {
    it('should remove a barcode', async () => {
      // Arrange
      const productId = 1;
      const barcode = '123';

      // Act
      await service.remove(productId, barcode);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ productId, code: barcode });
    });
  });
});
