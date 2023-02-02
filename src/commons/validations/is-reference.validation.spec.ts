import { Test, TestingModule } from '@nestjs/testing';
import { referenceFakeRepository } from 'src/base-fake/reference';
import { ReferenceService } from 'src/modules/reference/reference.service';

import { ReferenceConstraint } from './is-reference.validation';

describe('Reference validation', () => {
  let constraint: ReferenceConstraint;
  let service: ReferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenceConstraint,
        {
          provide: ReferenceService,
          useValue: {
            findById: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<ReferenceConstraint>(ReferenceConstraint);
    service = module.get<ReferenceService>(ReferenceService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a reference', async () => {
      // Arrange
      const id = 1;

      // Act
      const result = await constraint.validate(id);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should validate an invalid reference', async () => {
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
      expect(result).toEqual('reference is not valid');
    });
  });
});
