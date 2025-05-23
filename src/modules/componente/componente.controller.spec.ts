import { Test, TestingModule } from '@nestjs/testing';

import { componentFakeRepository } from 'src/base-fake/component';

import { ComponenteController } from './componente.controller';
import { ComponenteService } from './componente.service';

describe('ComponentsController', () => {
  let controller: ComponenteController;
  let componentsService: ComponenteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponenteController],
      providers: [
        {
          provide: ComponenteService,
          useValue: {
            find: jest.fn().mockResolvedValue(componentFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(componentFakeRepository.findOne()),
          },
        },
      ],
    }).compile();

    controller = module.get<ComponenteController>(ComponenteController);
    componentsService = module.get<ComponenteService>(ComponenteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(componentsService).toBeDefined();
  });

  describe('/ (GET)', () => {
    it('should return a list of component successfully', async () => {
      // Arrange
      const filter = 'filter';
      const blocked = true;

      // Act
      const response = await controller.find(filter, blocked);

      // Assert
      expect(componentsService.find).toHaveBeenCalledTimes(1);
      expect(componentsService.find).toHaveBeenCalledWith(filter, blocked);

      expect(response).toEqual(componentFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should return a component entity successfully', async () => {
      // Arrange
      const id = 'ADMFM001';

      // Act
      const response = await controller.findById(id);

      // Assert
      expect(componentsService.findById).toHaveBeenCalledTimes(1);
      expect(componentsService.findById).toHaveBeenCalledWith(id);

      expect(response).toEqual(componentFakeRepository.findOne());
    });
  });
});
