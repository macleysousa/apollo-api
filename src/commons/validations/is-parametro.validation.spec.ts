import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

import { ParametroService } from 'src/modules/parametro/parametro.service';

import { ParametroConstraint } from './is-parametro.validation';

describe('ParametroConstraint', () => {
  let constraint: ParametroConstraint;
  let service: ParametroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParametroConstraint,
        {
          provide: ParametroService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    constraint = module.get<ParametroConstraint>(ParametroConstraint);
    service = module.get<ParametroService>(ParametroService);
  });

  it('should be defined', () => {
    expect(constraint).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if parametro exists', async () => {
      // Arrange
      const value = 'parametro1' as any;
      jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: value, descricao: 'descricao1', valorPadrao: 'valor1' });

      // Act
      const result = await constraint.validate(value);

      // Assert
      expect(result).toBe(true);
      expect(service.findById).toHaveBeenCalledWith(value);
    });

    it('should return false if parametro does not exist', async () => {
      // Arrange
      const value = 'parametro1';
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      // Act
      const result = await constraint.validate(value);

      // Assert
      expect(result).toBe(false);
      expect(service.findById).toHaveBeenCalledWith(value);
    });
  });

  describe('defaultMessage', () => {
    it('should return default message', () => {
      // Arrange
      const validationArguments: ValidationArguments = {
        property: 'parametroId',
        value: undefined,
        constraints: [],
        targetName: '',
        object: undefined,
      };

      // Act
      const result = constraint.defaultMessage(validationArguments);

      // Assert
      expect(result).toBe('Parâmetro não encontrado');
    });
  });
});
