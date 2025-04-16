import { Test, TestingModule } from '@nestjs/testing';
import { TransacaoPontoController } from './transacao-ponto.controller';
import { TransacaoPontoService } from './transacao-ponto.service';

describe('TransacaoPontoController', () => {
  let controller: TransacaoPontoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacaoPontoController],
      providers: [TransacaoPontoService],
    }).compile();

    controller = module.get<TransacaoPontoController>(TransacaoPontoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
