import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { colorFakeRepository } from 'src/base-fake/color';
import { ILike, Repository } from 'typeorm';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorEntity } from './entities/color.entity';

describe('ColorService', () => {
  let service: ColorService;
  let repository: Repository<ColorEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorService,
        {
          provide: getRepositoryToken(ColorEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(colorFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ColorService>(ColorService);
    repository = module.get<Repository<ColorEntity>>(getRepositoryToken(ColorEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a color', async () => {
      //Arrange
      const color: CreateColorDto = { id: 1, name: 'RED', active: true };

      // Act
      const result = await service.create(color);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(color);

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('find', () => {
    it('should return a color list not use filter', async () => {
      // Arrange

      // Act
      const result = await service.find();

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${''}%`), active: undefined },
      });

      expect(result).toEqual(colorFakeRepository.find());
    });

    it('should return a color list use filter', async () => {
      // Arrange
      const name = 'back';
      const active = true;

      // Act
      const result = await service.find(name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${name}%`), active: Boolean(active) },
      });

      expect(result).toEqual(colorFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should return a color', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update color', async () => {
      // Arrange
      const id = 1;
      const color: UpdateColorDto = { name: 'white', active: false };

      // Act
      const result = await service.update(id, color);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({ ...colorFakeRepository.findOne(), ...color });

      expect(result).toEqual(colorFakeRepository.findOne());
    });
  });

  describe('delete', () => {
    it('should delete color', async () => {
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
