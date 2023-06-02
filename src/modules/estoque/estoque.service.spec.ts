import { Test, TestingModule } from '@nestjs/testing';
import { EstoqueService } from './estoque.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstoqueEntity } from './entities/estoque.entity';
import { Repository } from 'typeorm';

describe('EstoqueService', () => {
  let service: EstoqueService;
  let repository: Repository<EstoqueEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstoqueService,
        {
          provide: getRepositoryToken(EstoqueEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EstoqueService>(EstoqueService);
    repository = module.get<Repository<EstoqueEntity>>(getRepositoryToken(EstoqueEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
