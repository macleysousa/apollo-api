import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { componentGroupItemFakeRepository } from 'src/base-fake/component-group-item';

import { ComponenteGrupoItemService } from './componente-grupo-item.service';
import { AddComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponenteGrupoItemEntity } from './entities/componente-grupo-item.entity';

describe('ComponentGroupItemService', () => {
  let service: ComponenteGrupoItemService;
  let repository: Repository<ComponenteGrupoItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponenteGrupoItemService,
        {
          provide: getRepositoryToken(ComponenteGrupoItemEntity),
          useValue: {
            upsert: jest.fn(),
            find: jest.fn().mockResolvedValue(componentGroupItemFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(componentGroupItemFakeRepository.findOne()),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ComponenteGrupoItemService>(ComponenteGrupoItemService);
    repository = module.get<Repository<ComponenteGrupoItemEntity>>(getRepositoryToken(ComponenteGrupoItemEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('add', () => {
    it('should add component group item', async () => {
      // Arrage
      const grupoId = 1;
      const component: AddComponentGroupItemDto = { componenteId: 'ADMFM002' };

      // Act
      const response = await service.add(grupoId, component);

      // Assert
      expect(repository.upsert).toHaveBeenCalledTimes(1);
      expect(repository.upsert).toHaveBeenCalledWith({ grupoId, ...component }, { conflictPaths: ['grupoId', 'componenteId'] });

      expect(response).toEqual(componentGroupItemFakeRepository.find());
    });
  });

  describe('findByGroup', () => {
    it('should find component group item by group id', async () => {
      // Arrage
      const grupoId = 1;

      // Act
      const response = await service.findByGroup(grupoId);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { grupoId }, relations: ['componente'] });

      expect(response).toEqual(componentGroupItemFakeRepository.find());
    });
  });

  describe('findByComponent', () => {
    it('should find component group item by component id', async () => {
      // Arrage
      const grupoId = 1;
      const componenteId = 'ADMFM002';

      // Act
      const response = await service.findByComponent(grupoId, componenteId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { grupoId, componenteId }, relations: ['componente'] });

      expect(response).toEqual(componentGroupItemFakeRepository.findOne());
    });
  });

  describe('remove', () => {
    it('should remove component group item', async () => {
      // Arrage
      const grupoId = 1;
      const componenteId = 'ADMFM002';

      // Act
      await service.remove(grupoId, componenteId);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ grupoId, componenteId });
    });
  });
});
