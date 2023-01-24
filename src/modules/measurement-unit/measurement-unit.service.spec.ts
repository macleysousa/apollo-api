import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { unitMeasureFakeRepository } from 'src/base-fake/measurement-unit';

import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMeasurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnitEntity } from './entities/measurement-unit.entity';
import { MeasurementUnitService } from './measurement-unit.service';

describe('MeasurementUnitService', () => {
  let service: MeasurementUnitService;
  let repository: Repository<MeasurementUnitEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementUnitService,
        {
          provide: getRepositoryToken(MeasurementUnitEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(unitMeasureFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(unitMeasureFakeRepository.find()),
            findOne: jest.fn().mockResolvedValue(unitMeasureFakeRepository.findOne()),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MeasurementUnitService>(MeasurementUnitService);
    repository = module.get<Repository<MeasurementUnitEntity>>(getRepositoryToken(MeasurementUnitEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new unit measure', async () => {
      // Arrange
      const category: CreateMeasurementUnitDto = { name: 'Name', active: true };
      jest.spyOn(service, 'findByName').mockResolvedValue(undefined);

      // Act
      const result = await service.create(category);

      // Assert
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(category);

      expect(result).toEqual(unitMeasureFakeRepository.findOne());
    });

    it('should create a new unit measure with error *Unit measure with name ${createDto.name} already exists*', async () => {
      // Arrange
      const createDto: CreateMeasurementUnitDto = { name: 'Name', active: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.create(createDto)).rejects.toEqual(new BadRequestException(`Unit measure with name ${createDto.name} already exists`));
    });
  });

  describe('find', () => {
    it('should find all unit measures with no filter', async () => {
      // Arrange
      const name = undefined;
      const active = undefined;

      // Act
      const result = await service.find(name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${''}%`), active: undefined },
      });

      expect(result).toEqual(unitMeasureFakeRepository.find());
    });

    it('should find all unit measures with filter', async () => {
      // Arrange
      const name = 'Name';
      const active = true;

      // Act
      const result = await service.find(name, active);

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${name}%`), active },
      });

      expect(result).toEqual(unitMeasureFakeRepository.find());
    });
  });

  describe('findById', () => {
    it('should find a unit measure by id', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await service.findById(id);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual(unitMeasureFakeRepository.findOne());
    });
  });

  describe('findByName', () => {
    it('should find a unit measure by name', async () => {
      // Arrange
      const name = 'Name';

      // Act
      const result = await service.findByName(name);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name } });

      expect(result).toEqual(unitMeasureFakeRepository.findOne());
    });
  });

  describe('update', () => {
    it('should update a unit measure', async () => {
      // Arrange
      const id = 1;
      const updateDto: UpdateMeasurementUnitDto = { name: 'Name', active: true };

      // Act
      const result = await service.update(id, updateDto);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(id, updateDto);

      expect(result).toEqual(unitMeasureFakeRepository.findOne());
    });

    it('should update a brand with error *Unit measure with id ${id} not found*', async () => {
      // Arrange
      const id = 1;
      const updateDto: UpdateMeasurementUnitDto = { name: 'name', active: true };
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      // Act

      // Assert
      expect(service.update(id, updateDto)).rejects.toEqual(new BadRequestException(`Unit measure with id ${id} not found`));
    });

    it('should update a brand with error *Unit measure with this name ${brand.name} already exists*', async () => {
      // Arrange
      const id = 2;
      const updateDto: UpdateMeasurementUnitDto = { name: 'name', active: true };

      // Act

      // Assert
      expect(service.update(id, updateDto)).rejects.toEqual(
        new BadRequestException(`Unit measure with name ${updateDto.name} already exists`)
      );
    });
  });

  describe('remove', () => {
    it('should remove a brand', async () => {
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
