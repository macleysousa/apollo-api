import { Test, TestingModule } from '@nestjs/testing';
import { referenceFakeRepository } from 'src/base-fake/reference';
import { ReferenciaService } from 'src/modules/referencia/referencia.service';

import { ReferenciaConstraint } from './is-referencia.validation';
import { ValidationArguments } from 'class-validator';

describe('Reference validation', () => {
  let constraint: ReferenciaConstraint;
  let service: ReferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenciaConstraint,
        {
          provide: ReferenciaService,
          useValue: {
            findById: jest.fn().mockResolvedValue(referenceFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<ReferenciaConstraint>(ReferenciaConstraint);
    service = module.get<ReferenciaService>(ReferenciaService);
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
      const validationArguments = { value: 1, constraints: [] } as ValidationArguments;
      // Act
      const result = constraint.defaultMessage(validationArguments);

      // Assert
      expect(result).toEqual(`Referência "${validationArguments.value}" não encontrada`);
    });
  });
});
