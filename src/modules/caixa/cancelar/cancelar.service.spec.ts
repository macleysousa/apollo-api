import { Test, TestingModule } from '@nestjs/testing';
import { CancelarService } from './cancelar.service';

describe('CancelarService', () => {
  let service: CancelarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancelarService],
    }).compile();

    service = module.get<CancelarService>(CancelarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
