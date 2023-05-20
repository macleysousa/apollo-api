import { Test, TestingModule } from '@nestjs/testing';
import { colorFakeRepository } from 'src/base-fake/color';
import { CorService } from 'src/modules/cor/cor.service';

import { ColorConstraint } from './is-color.validation';

describe('Color validation', () => {
  let constraint: ColorConstraint;
  let service: CorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorConstraint,
        {
          provide: CorService,
          useValue: {
            findById: jest.fn().mockResolvedValue(colorFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<ColorConstraint>(ColorConstraint);
    service = module.get<CorService>(CorService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a color', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await constraint.validate(id);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid color', async () => {
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
      expect(result).toEqual('color is not valid');
    });
  });
});
