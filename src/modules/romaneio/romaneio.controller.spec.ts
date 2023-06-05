import { Test, TestingModule } from '@nestjs/testing';

import { RomaneioController } from './romaneio.controller';
import { RomaneioService } from './romaneio.service';

describe('RomaneioController', () => {
  let controller: RomaneioController;
  let service: RomaneioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RomaneioController],
      providers: [
        {
          provide: RomaneioService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RomaneioController>(RomaneioController);
    service = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
