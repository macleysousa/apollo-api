import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { ConsignacaoService } from './consignacao.service';
import { ConsignacaoEntity } from './entities/consignacao.entity';

describe('ConsignacaoService', () => {
  let service: ConsignacaoService;
  let repository: Repository<ConsignacaoEntity>;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsignacaoService,
        {
          provide: getRepositoryToken(ConsignacaoEntity),
          useValue: {},
        },
        {
          provide: ContextService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ConsignacaoService>(ConsignacaoService);
    repository = module.get<Repository<ConsignacaoEntity>>(getRepositoryToken(ConsignacaoEntity));
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
  });
});
