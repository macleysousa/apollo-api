import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

import { componentFakeRepository } from 'src/base-fake/component';

import { ComponenteService } from './componente.service';
import { ComponenteEntity } from './entities/componente.entity';

describe('ComponentsService', () => {
  let service: ComponenteService;
  let componentRepository: Repository<ComponenteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponenteService,
        {
          provide: getRepositoryToken(ComponenteEntity),
          useValue: {
            upsert: jest.fn(),
            findOne: jest.fn().mockResolvedValue(componentFakeRepository.findOne()),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn(),
              andWhere: jest.fn(),
              getMany: jest.fn().mockResolvedValue(componentFakeRepository.find()),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ComponenteService>(ComponenteService);
    componentRepository = module.get<Repository<ComponenteEntity>>(getRepositoryToken(ComponenteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(componentRepository).toBeDefined();
  });

  describe('popular', () => {
    it('should return popular components', async () => {
      // Arrange
      // const components: ComponentEntity[] = new Array(10).fill(componentFakeRepository.findOne());

      // Act
      await service.popular();

      // Assert

      expect(componentRepository.upsert).toHaveBeenCalledTimes(1);
      expect(componentRepository.upsert).toHaveBeenCalledWith([], { conflictPaths: ['id'] });
    });
  });

  describe('find', () => {
    it('should return a list of component successfully', async () => {
      // Arrange
      const filter = 'filter';
      const blocked = true;

      // Act
      const response = await service.find(filter, blocked);

      // Assert
      expect(componentRepository.createQueryBuilder).toHaveBeenCalledTimes(1);

      expect(componentRepository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
      expect(componentRepository.createQueryBuilder().where).toHaveBeenCalledWith({ id: Not(IsNull()) });

      expect(componentRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(3);

      expect(response).toEqual(componentFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should return a component entity successfully', async () => {
      // Arrange
      const id = 'filter';

      // Act
      const response = await service.findById(id);

      // Assert
      expect(componentRepository.findOne).toHaveBeenCalledTimes(1);
      expect(componentRepository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(response).toEqual(componentFakeRepository.findOne());
    });
  });
});
