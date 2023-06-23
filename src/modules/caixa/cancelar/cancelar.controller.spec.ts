import { Test, TestingModule } from '@nestjs/testing';
import { CancelarController } from './cancelar.controller';
import { CancelarService } from './cancelar.service';

describe('CancelarController', () => {
  let controller: CancelarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancelarController],
      providers: [CancelarService],
    }).compile();

    controller = module.get<CancelarController>(CancelarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
