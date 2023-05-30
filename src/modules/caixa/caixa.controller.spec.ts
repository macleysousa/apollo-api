import { Test, TestingModule } from '@nestjs/testing';

import { CaixaController } from './caixa.controller';
import { CaixaService } from './caixa.service';
import { CreateCaixaDto } from './dto/create-caixa.dto';
import { CaixaEntity } from './entities/caixa.entity';
import { caixaFakeRepository } from 'src/base-fake/caixa';

describe('CaixaController', () => {
  let controller: CaixaController;
  let service: CaixaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaixaController],
      providers: [
        {
          provide: CaixaService,
          useValue: {
            open: jest.fn().mockResolvedValue(caixaFakeRepository.caixaAberto()),
          },
        },
      ],
    }).compile();

    controller = module.get<CaixaController>(CaixaController);
    service = module.get<CaixaService>(CaixaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('open', () => {
    it('should create a new caixa', async () => {
      const createCaixaDto: CreateCaixaDto = {
        empresaId: 1,
        terminalId: 1,
      };

      const result = await controller.open(createCaixaDto);

      expect(service.open).toHaveBeenCalledWith(createCaixaDto);
      expect(result).toEqual(caixaFakeRepository.caixaAberto());
    });
  });
});
