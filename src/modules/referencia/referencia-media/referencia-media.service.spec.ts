import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StorageService } from 'src/storage/storage.service';

import { ReferenciaMediaEntity } from './entities/referencia-media.entity';
import { ReferenciaMediaService } from './referencia-media.service';

describe('ReferenciaMediaService', () => {
  let service: ReferenciaMediaService;
  let repository: Repository<ReferenciaMediaEntity>;
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenciaMediaService,
        {
          provide: getRepositoryToken(ReferenciaMediaEntity),
          useClass: Repository,
        },
        {
          provide: StorageService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReferenciaMediaService>(ReferenciaMediaService);
    repository = module.get<Repository<ReferenciaMediaEntity>>(getRepositoryToken(ReferenciaMediaEntity));
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(storageService).toBeDefined();
  });
});
