import { Test, TestingModule } from '@nestjs/testing';
import { sizeFakeRepository } from 'src/base-fake/size';
import { SizeService } from 'src/modules/size/size.service';

import { SizeConstraint } from './is-size.validation';

describe('Size validation', () => {
  let constraint: SizeConstraint;
  let service: SizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SizeConstraint,
        {
          provide: SizeService,
          useValue: {
            findById: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<SizeConstraint>(SizeConstraint);
    service = module.get<SizeService>(SizeService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a size', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await constraint.validate(id);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid size', async () => {
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
      expect(result).toEqual('size is not valid');
    });
  });
});
