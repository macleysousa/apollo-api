import { Test, TestingModule } from '@nestjs/testing';
import { componentGroupFakeRepository } from 'src/base-fake/component-group';
import { ComponentGroupController } from './component-group.controller';
import { ComponentGroupService } from './component-group.service';
import { CreateComponentGroupDto } from './dto/create-component-group.dto';
import { UpdateComponentGroupDto } from './dto/update-component-group.dto';

describe('ComponentGroupController', () => {
  let controller: ComponentGroupController;
  let service: ComponentGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentGroupController],
      providers: [
        {
          provide: ComponentGroupService,
          useValue: {
            create: jest.fn().mockResolvedValue(componentGroupFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(componentGroupFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(componentGroupFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(componentGroupFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ComponentGroupController>(ComponentGroupController);
    service = module.get<ComponentGroupService>(ComponentGroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (Post)', () => {
    it('should create a component group', async () => {
      // Arrange
      const componentGroup: CreateComponentGroupDto = { name: 'test' };

      // Act
      const response = await controller.create(componentGroup);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(componentGroup);

      expect(response).toEqual(componentGroupFakeRepository.findOne());
    });
  });

  describe('/ (Get)', () => {
    it('should return a list of component groups', async () => {
      // Arrange
      const name = undefined;

      // Act
      const response = await controller.find(name);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(name);

      expect(response).toEqual(componentGroupFakeRepository.find());
    });
  });

  describe('/:id (Get)', () => {
    it('should return a component group', async () => {
      // Arrange
      const id = 1;

      // Act
      const response = await controller.findOne(id);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id);

      expect(response).toEqual(componentGroupFakeRepository.findOne());
    });
  });

  describe('/:id (Put)', () => {
    it('should update a component group', async () => {
      // Arrange
      const id = 1;
      const componentGroup: UpdateComponentGroupDto = { name: 'test' };

      // Act
      const response = await controller.update(id, componentGroup);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, componentGroup);

      expect(response).toEqual(componentGroupFakeRepository.findOne());
    });
  });

  describe('/:id (Delete)', () => {
    it('should delete a component group', async () => {
      // Arrange
      const id = 1;

      // Act
      await controller.remove(id);

      // Assert
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
