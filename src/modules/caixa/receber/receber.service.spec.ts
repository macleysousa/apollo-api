import { Test, TestingModule } from '@nestjs/testing';

import { ContextService } from 'src/context/context.service';
import { FaturaService } from 'src/modules/fatura/fatura.service';
import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';

import { ReceberService } from './receber.service';

describe('ReceberService', () => {
  let service: ReceberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceberService,
        {
          provide: ContextService,
          useValue: {},
        },
        {
          provide: FormaDePagamentoService,
          useValue: {},
        },
        {
          provide: FaturaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReceberService>(ReceberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
