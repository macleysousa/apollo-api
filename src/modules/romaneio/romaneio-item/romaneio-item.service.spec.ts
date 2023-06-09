import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';
import { EstoqueService } from 'src/modules/estoque/estoque.service';

import { RomaneioService } from '../romaneio.service';
import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioItemService } from './romaneio-item.service';
import { RomaneioItemView } from './views/romaneio-item.view';
import { PrecoReferenciaService } from 'src/modules/tabela-de-preco/referencia/referencia.service';

describe('RomaneioItemService', () => {
  let service: RomaneioItemService;
  let repository: Repository<RomaneioItemEntity>;
  let view: Repository<RomaneioItemView>;
  let romaneioService: RomaneioService;
  let contextService: ContextService;
  let estoqueService: EstoqueService;
  let precoService: PrecoReferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RomaneioItemService,
        {
          provide: getRepositoryToken(RomaneioItemEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RomaneioItemView),
          useValue: {},
        },
        {
          provide: RomaneioService,
          useValue: {},
        },
        {
          provide: ContextService,
          useValue: {},
        },
        {
          provide: EstoqueService,
          useValue: {},
        },
        {
          provide: PrecoReferenciaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RomaneioItemService>(RomaneioItemService);
    repository = module.get<Repository<RomaneioItemEntity>>(getRepositoryToken(RomaneioItemEntity));
    view = module.get<Repository<RomaneioItemView>>(getRepositoryToken(RomaneioItemView));
    romaneioService = module.get<RomaneioService>(RomaneioService);
    contextService = module.get<ContextService>(ContextService);
    estoqueService = module.get<EstoqueService>(EstoqueService);
    precoService = module.get<PrecoReferenciaService>(PrecoReferenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(view).toBeDefined();
    expect(romaneioService).toBeDefined();
    expect(contextService).toBeDefined();
    expect(estoqueService).toBeDefined();
    expect(precoService).toBeDefined();
  });
});
