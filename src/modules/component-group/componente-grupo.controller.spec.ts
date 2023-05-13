import { Test, TestingModule } from '@nestjs/testing';
import { componentGroupFakeRepository } from 'src/base-fake/component-group';
import { ComponenteGrupoController } from './componente-grupo.controller';
import { ComponenteGrupoService } from './componente-grupo.service';
import { CreateComponenteGrupoDto } from './dto/criar-componente-grupo.dto';
import { UpdateComponentGroupDto } from './dto/atualizar-componente-grupo.dto';

describe('ComponentGroupController', () => {
  let controller: ComponenteGrupoController;
  let service: ComponenteGrupoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponenteGrupoController],
      providers: [
        {
          provide: ComponenteGrupoService,
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

    controller = module.get<ComponenteGrupoController>(ComponenteGrupoController);
    service = module.get<ComponenteGrupoService>(ComponenteGrupoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (Post)', () => {
    it('should create a component group', async () => {
      // Arrange
      const componentGroup: CreateComponenteGrupoDto = { nome: 'test' };

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
      const componentGroup: UpdateComponentGroupDto = { nome: 'test' };

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
