import { Test, TestingModule } from '@nestjs/testing';
import { FaturaParcelaController } from './parcela.controller';
import { FaturaParcelaService } from './parcela.service';
import { EmpresaService } from 'src/modules/empresa/empresa.service';

describe('ParcelaController', () => {
  let controller: FaturaParcelaController;
  let service: FaturaParcelaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaturaParcelaController],
      providers: [
        {
          provide: FaturaParcelaService,
          useValue: {},
        },
        {
          provide: EmpresaService,
          useValue: {
            findById: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<FaturaParcelaController>(FaturaParcelaController);
    service = module.get<FaturaParcelaService>(FaturaParcelaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
