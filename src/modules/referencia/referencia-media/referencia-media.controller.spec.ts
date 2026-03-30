import { Test, TestingModule } from '@nestjs/testing';

import { ReferenciaMediaController } from './referencia-media.controller';
import { ReferenciaMediaService } from './referencia-media.service';

describe('ReferenciaMediaController', () => {
  let controller: ReferenciaMediaController;
  let service: ReferenciaMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenciaMediaController],
      providers: [
        {
          provide: ReferenciaMediaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ReferenciaMediaController>(ReferenciaMediaController);
    service = module.get<ReferenciaMediaService>(ReferenciaMediaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
