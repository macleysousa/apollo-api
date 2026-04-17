import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StorageService } from 'src/storage/storage.service';

import { ReferenciaService } from '../referencia.service';

import { ReferenciaMediaEntity } from './entities/referencia-media.entity';
import { ReferenciaMediaService } from './referencia-media.service';

describe('ReferenciaMediaService', () => {
  let service: ReferenciaMediaService;
  let repository: Repository<ReferenciaMediaEntity>;
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenciaMediaService,
        {
          provide: getRepositoryToken(ReferenciaMediaEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: StorageService,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: ReferenciaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReferenciaMediaService>(ReferenciaMediaService);
    repository = module.get<Repository<ReferenciaMediaEntity>>(getRepositoryToken(ReferenciaMediaEntity));
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(storageService).toBeDefined();
  });

  describe('findPublic', () => {
    it('should return only public medias by reference id', async () => {
      const referenciaId = 1;

      await service.findPublic(referenciaId);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { referenciaId, isPublic: true } });
    });
  });

  describe('delete', () => {
    it('should delete media using id and referenciaId', async () => {
      const referenciaId = 1;
      const id = 12;
      const media = { id, referenciaId, url: 'referencias/teste.jpg' } as ReferenciaMediaEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(media);

      await service.delete(referenciaId, id);

      expect(storageService.delete).toHaveBeenCalledWith(media.url);
      expect(repository.delete).toHaveBeenCalledWith({ id, referenciaId });
    });
  });
});
