import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { componentFakeRepository } from 'src/base-fake/component';
import { IsNull, Not, Repository } from 'typeorm';
import { ComponentService } from './component.service';
import { ComponentEntity } from './entities/component.entity';

describe('ComponentsService', () => {
  let service: ComponentService;
  let componentRepository: Repository<ComponentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentService,
        {
          provide: getRepositoryToken(ComponentEntity),
          useValue: {
            save: jest.fn(),
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

    service = module.get<ComponentService>(ComponentService);
    componentRepository = module.get<Repository<ComponentEntity>>(getRepositoryToken(ComponentEntity));
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

      expect(componentRepository.save).toHaveBeenCalledTimes(1);
      expect(componentRepository.save).toHaveBeenCalledWith([]);
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
