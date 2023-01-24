import { Test, TestingModule } from '@nestjs/testing';
import { unitMeasureFakeRepository } from 'src/base-fake/measurement-unit';

import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMeasurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnitController } from './measurement-unit.controller';
import { MeasurementUnitService } from './measurement-unit.service';

describe('MeasurementUnitController', () => {
  let controller: MeasurementUnitController;
  let service: MeasurementUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementUnitController],
      providers: [
        {
          provide: MeasurementUnitService,
          useValue: {
            create: jest.fn().mockResolvedValue(unitMeasureFakeRepository.findOne()),
            find: jest.fn().mockResolvedValue(unitMeasureFakeRepository.find()),
            findById: jest.fn().mockResolvedValue(unitMeasureFakeRepository.findOne()),
            update: jest.fn().mockResolvedValue(unitMeasureFakeRepository.findOne()),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeasurementUnitController>(MeasurementUnitController);
    service = module.get<MeasurementUnitService>(MeasurementUnitService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('/ (POST)', () => {
    it('should create a new unit measure', async () => {
      // Arrange
      const createDto: CreateMeasurementUnitDto = { name: 'Name', active: true };

      // Act
      const result = await controller.create(createDto);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);

      expect(result).toEqual(unitMeasureFakeRepository.findOne());
    });
  });

  describe('/ (GET)', () => {
    it('should return a list of unit measures', async () => {
      // Arrange
      const name = undefined;
      const active = undefined;

      // Act
      const result = await controller.find(name, active);

      // Assert
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(name, active);

      expect(result).toEqual(unitMeasureFakeRepository.find());
    });
  });

  describe('/:id (GET)', () => {
    it('should return a unit measure', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await controller.findById(id);

      // Assert
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(id);

      expect(result).toEqual(unitMeasureFakeRepository.findOne());
    });
  });

  describe('/:id (PUT)', () => {
    it('should update a unit measure', async () => {
      // Arrange
      const id = 1;
      const updateDto: UpdateMeasurementUnitDto = { name: 'Name', active: true };

      // Act
      const result = await controller.update(id, updateDto);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);

      expect(result).toEqual(unitMeasureFakeRepository.findOne());
    });
  });

  describe('/:id (DELETE)', () => {
    it('should delete a unit measure', async () => {
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
