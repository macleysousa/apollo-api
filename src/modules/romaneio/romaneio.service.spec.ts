import { Test, TestingModule } from '@nestjs/testing';
import { RomaneioService } from './romaneio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RomaneioEntity } from './entities/romaneio.entity';
import { Repository } from 'typeorm';
import { ContextService } from 'src/context/context.service';

describe('RomaneioService', () => {
  let service: RomaneioService;
  let repository: Repository<RomaneioEntity>;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioService,
        {
          provide: getRepositoryToken(RomaneioEntity),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ContextService,
          useValue: {
            currentUser: jest.fn().mockResolvedValue({ id: 1 }),
            currentBranch: jest.fn().mockResolvedValue({ id: 1, data: new Date('2023-06-05') }),
          },
        },
      ],
    }).compile();

    service = module.get<RomaneioService>(RomaneioService);
    repository = module.get<Repository<RomaneioEntity>>(getRepositoryToken(RomaneioEntity));
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
  });
});
