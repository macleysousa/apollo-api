import { Test, TestingModule } from '@nestjs/testing';
import { ConsignacaoController } from './consignacao.controller';
import { ConsignacaoService } from './consignacao.service';

describe('ConsignacaoController', () => {
  let controller: ConsignacaoController;
  let service: ConsignacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsignacaoController],
      providers: [
        {
          provide: ConsignacaoService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ConsignacaoController>(ConsignacaoController);
    service = module.get<ConsignacaoService>(ConsignacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
