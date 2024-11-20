import { Test, TestingModule } from '@nestjs/testing';

import { componentGroupItemFakeRepository } from 'src/base-fake/component-group-item';

import { ComponenteGrupoItemController } from './componente-grupo-item.controller';
import { ComponenteGrupoItemService } from './componente-grupo-item.service';
import { AddComponentGroupItemDto } from './dto/create-component-group-item.dto';

describe('ComponentGroupItemController', () => {
  let controller: ComponenteGrupoItemController;
  let service: ComponenteGrupoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponenteGrupoItemController],
      providers: [
        {
          provide: ComponenteGrupoItemService,
          useValue: {
            add: jest.fn().mockResolvedValue(componentGroupItemFakeRepository.findOne()),
            findByGroup: jest.fn().mockResolvedValue(componentGroupItemFakeRepository.find()),
            findByComponent: jest.fn().mockResolvedValue(componentGroupItemFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ComponenteGrupoItemController>(ComponenteGrupoItemController);
    service = module.get<ComponenteGrupoItemService>(ComponenteGrupoItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should return a new component group item', async () => {
      // Arrange
      const groupId = 1;
      const componentGroupItem: AddComponentGroupItemDto = { componenteId: 'ADMFM001' };

      // Act
      const result = await controller.add(groupId, componentGroupItem);

      // Assert
      expect(service.add).toHaveBeenCalledTimes(1);
      expect(service.add).toHaveBeenCalledWith(groupId, componentGroupItem);

      expect(result).toEqual(componentGroupItemFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return all component group items', async () => {
      // Arrange
      const groupId = 1;

      // Act
      const result = await controller.findByGroup(groupId);

      // Assert
      expect(service.findByGroup).toHaveBeenCalledTimes(1);
      expect(service.findByGroup).toHaveBeenCalledWith(groupId);

      expect(result).toEqual(componentGroupItemFakeRepository.find());
    });
  });

  describe('/:component (GET)', () => {
    it('should return a component group item', async () => {
      // Arrange
      const groupId = 1;
      const componentId = 'ADMFM001';

      // Act
      const result = await controller.findByComponent(groupId, componentId);

      // Assert
      expect(service.findByComponent).toHaveBeenCalledTimes(1);
      expect(service.findByComponent).toHaveBeenCalledWith(groupId, componentId);

      expect(result).toEqual(componentGroupItemFakeRepository.findOne());
    });
  });

  describe('/:component (DELETE)', () => {
    it('should remove a component group item', async () => {
      // Arrange
      const groupId = 1;
      const componentId = 'ADMFM001';

      // Act
      await controller.remove(groupId, componentId);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(groupId, componentId);
    });
  });
});
