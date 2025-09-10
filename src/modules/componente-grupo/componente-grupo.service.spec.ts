import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { componentGroupFakeRepository } from 'src/base-fake/component-group';

import { ComponenteGrupoService } from './componente-grupo.service';
import { UpdateComponentGroupDto } from './dto/atualizar-componente-grupo.dto';
import { CreateComponenteGrupoDto } from './dto/criar-componente-grupo.dto';
import { ComponenteGrupoEntity } from './entities/componente-grupo.entity';

describe('ComponentGroupService', () => {
  let service: ComponenteGrupoService;
  let repository: Repository<ComponenteGrupoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponenteGrupoService,
        {
          provide: getRepositoryToken(ComponenteGrupoEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(componentGroupFakeRepository.find()),
            }),
            save: jest.fn().mockResolvedValue(componentGroupFakeRepository.findOne()),
            find: jest.fn().mockReturnValue(componentGroupFakeRepository.find()),
            findOne: jest.fn().mockReturnValue(componentGroupFakeRepository.findOne()),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ComponenteGrupoService>(ComponenteGrupoService);
    repository = module.get<Repository<ComponenteGrupoEntity>>(getRepositoryToken(ComponenteGrupoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a component group entity with success', async () => {
      // Arrange
      const componentGroup: CreateComponenteGrupoDto = { nome: 'admin' };

      // Act
      const response = await service.create(componentGroup);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({ nome: componentGroup.nome });

      expect(response).toEqual(componentGroupFakeRepository.findOne());
    });
  });

  describe('find', () => {
    it('should return a list groups with success', async () => {
      // Arrange
      const nome = 'admin';

      // Act
      const response = await service.find(nome);

      // Assert
      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('grupo');

      expect(response).toBeDefined();

      expect(response).toEqual(componentGroupFakeRepository.find());
    });

    it('should return a list groups with success not pass filter', async () => {
      // Arrange

      // Act
      const response = await service.find();

      // Assert
      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('grupo');

      expect(response).toEqual(componentGroupFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should return a group with success', async () => {
      // Arrange
      const id = 1;

      // Act
      const response = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['componentes.componente'] });

      expect(response).toEqual(componentGroupFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a group with failed error *Group with id ${id} not found*', async () => {
      // Arrange
      const id = 1;
      const componentGroup: UpdateComponentGroupDto = { nome: 'admin' };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      // Act

      // Assert
      expect(service.update(id, componentGroup)).rejects.toEqual(new Error(`Group with id ${id} not found`));
      expect(repository.save).toHaveBeenCalledTimes(0);
    });

    it('should update a group with success', async () => {
      // Arrange
      const id = 1;
      const componentGroup: UpdateComponentGroupDto = { nome: 'admin' };
      const group = { ...componentGroupFakeRepository.findOne(), ...componentGroup };

      // Act
      const response = await service.update(id, componentGroup);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(group);

      expect(response).toEqual(group);
    });
  });

  describe('remove', () => {
    it('should remove a group with failed error *Group with id ${id} not found*', async () => {
      // Arrange
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      // Act

      // Assert
      expect(service.remove(id)).rejects.toEqual(new Error(`Group with id ${id} not found`));
      expect(repository.save).toHaveBeenCalledTimes(0);
    });

    it('should remove a group with success', async () => {
      // Arrange
      const id = 1;

      // Act
      await service.remove(id);

      // Assert
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
