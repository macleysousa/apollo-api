import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BarcodeService } from './barcode.service';
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
          useValue: {},
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
});
