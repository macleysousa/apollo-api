import { Test, TestingModule } from '@nestjs/testing';

import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';

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
            find: jest.fn().mockResolvedValue([]),
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
    it('should expose medias listing as a public route', () => {
      expect(Reflect.getMetadata(IS_PUBLIC_KEY, controller.find)).toBe(true);
    });

    it('should return only public medias from a reference when user is not authenticated', async () => {
      const referenciaId = 1;

      const result = await controller.find(referenciaId, {} as any);

      expect(service.findPublic).toHaveBeenCalledTimes(1);
      expect(service.findPublic).toHaveBeenCalledWith(referenciaId);
      expect(result).toEqual([]);
    });

    it('should return all medias from a reference when user is authenticated', async () => {
      const referenciaId = 1;

      await controller.find(referenciaId, { usuario: { id: 123 } } as any);

      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(referenciaId);
    });

    it('should return only public medias from a reference', async () => {
      const referenciaId = 1;

      const result = await controller.findPublic(referenciaId);

      expect(service.findPublic).toHaveBeenCalledWith(referenciaId);
      expect(result).toEqual([]);
    });
  });
});
