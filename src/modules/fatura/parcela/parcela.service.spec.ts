import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { FaturaService } from '../fatura.service';
import { FaturaParcelaEntity } from './entities/parcela.entity';
import { FaturaParcelaService } from './parcela.service';

describe('ParcelaService', () => {
  let service: FaturaParcelaService;
  let repository: Repository<FaturaParcelaEntity>;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaturaParcelaService,
        {
          provide: getRepositoryToken(FaturaParcelaEntity),
          useValue: {},
        },
        {
          provide: FaturaService,
          useValue: {},
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockReturnValue({ id: 1 }),
            currentBranch: jest.fn().mockReturnValue({ id: 1, data: new Date('16-06-2023') }),
          },
        },
      ],
    }).compile();

    service = module.get<FaturaParcelaService>(FaturaParcelaService);
    repository = module.get<Repository<FaturaParcelaEntity>>(getRepositoryToken(FaturaParcelaEntity));
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
  });
});
