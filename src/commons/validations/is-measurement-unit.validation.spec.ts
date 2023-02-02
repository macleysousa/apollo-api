import { Test, TestingModule } from '@nestjs/testing';
import { unitMeasureFakeRepository } from 'src/base-fake/measurement-unit';
import { MeasurementUnitService } from 'src/modules/measurement-unit/measurement-unit.service';

import { MeasurementUnitConstraint } from './is-measurement-unit.validation';

describe('Measurement unit validation', () => {
  let constraint: MeasurementUnitConstraint;
  let service: MeasurementUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasurementUnitConstraint,
        {
          provide: MeasurementUnitService,
          useValue: {
            findById: jest.fn().mockResolvedValue(unitMeasureFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<MeasurementUnitConstraint>(MeasurementUnitConstraint);
    service = module.get<MeasurementUnitService>(MeasurementUnitService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a measurement unit', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await constraint.validate(id);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid measurement unit', async () => {
      // Arrange
      const id = 2;
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      // Act
      const result = await constraint.validate(id);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('default message', () => {
    it('should return the default message', () => {
      // Act
      const result = constraint.defaultMessage();

      // Assert
      expect(result).toEqual('measurement unit is not valid');
    });
  });
});
