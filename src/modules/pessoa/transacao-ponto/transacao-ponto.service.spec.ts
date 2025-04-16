import { Test, TestingModule } from '@nestjs/testing';
import { TransacaoPontoService } from './transacao-ponto.service';

describe('TransacaoPontoService', () => {
  let service: TransacaoPontoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransacaoPontoService],
    }).compile();

    service = module.get<TransacaoPontoService>(TransacaoPontoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
