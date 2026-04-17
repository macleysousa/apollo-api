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
          useValue: {
            find: jest.fn(),
            findPublic: jest.fn().mockResolvedValue([]),
          },
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

  describe('GET public medias', () => {
    it('should return only public medias from a reference', async () => {
      const referenciaId = 1;

      const result = await controller.findPublic(referenciaId);

      expect(service.findPublic).toHaveBeenCalledTimes(1);
      expect(service.findPublic).toHaveBeenCalledWith(referenciaId);
      expect(result).toEqual([]);
    });
  });
});
