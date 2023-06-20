import { Test, TestingModule } from '@nestjs/testing';

import { ContextService } from 'src/context/context.service';

import { CaixaService } from '../caixa.service';
import { ReceberController } from './receber.controller';
import { ReceberService } from './receber.service';

describe('ReceberController', () => {
  let controller: ReceberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceberController],
      providers: [
        {
          provide: ReceberService,
          useValue: {},
        },
        {
          provide: CaixaService,
          useValue: {},
        },
        {
          provide: ContextService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ReceberController>(ReceberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
