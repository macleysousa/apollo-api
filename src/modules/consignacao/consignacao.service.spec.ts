import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import { ConsignacaoService } from './consignacao.service';
import { ConsignacaoEntity } from './entities/consignacao.entity';
import { RomaneioItemService } from '../romaneio/romaneio-item/romaneio-item.service';
import { ConsignacaoItemService } from './consignacao-item/consignacao-item.service';

describe('ConsignacaoService', () => {
  let service: ConsignacaoService;
  let repository: Repository<ConsignacaoEntity>;
  let contextService: ContextService;
  let romanaioItemService: RomaneioItemService;
  let consignacaoItemService: ConsignacaoItemService;

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
        {
          provide: RomaneioItemService,
          useValue: {},
        },
        {
          provide: ConsignacaoItemService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ConsignacaoService>(ConsignacaoService);
    repository = module.get<Repository<ConsignacaoEntity>>(getRepositoryToken(ConsignacaoEntity));
    contextService = module.get<ContextService>(ContextService);
    romanaioItemService = module.get<RomaneioItemService>(RomaneioItemService);
    consignacaoItemService = module.get<ConsignacaoItemService>(ConsignacaoItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(contextService).toBeDefined();
    expect(romanaioItemService).toBeDefined();
    expect(consignacaoItemService).toBeDefined();
  });
});
