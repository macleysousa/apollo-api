import { Test, TestingModule } from '@nestjs/testing';
import { sizeFakeRepository } from 'src/base-fake/size';
import { TamanhoService } from 'src/modules/tamanho/tamanho.service';

import { TamanhoConstraint } from './is-tamanho.validation';

describe('Size validation', () => {
  let constraint: TamanhoConstraint;
  let service: TamanhoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TamanhoConstraint,
        {
          provide: TamanhoService,
          useValue: {
            findById: jest.fn().mockResolvedValue(sizeFakeRepository.findOne()),
          },
        },
      ],
    }).compile();
    constraint = module.get<TamanhoConstraint>(TamanhoConstraint);
    service = module.get<TamanhoService>(TamanhoService);
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
