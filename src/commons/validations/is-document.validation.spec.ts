import { ValidationArguments } from 'class-validator';

import { IsValidDocumentConstraint } from './is-document.validation';

describe('IsValidDocumentConstraint', () => {
  let constraint: IsValidDocumentConstraint;

  beforeEach(() => {
    constraint = new IsValidDocumentConstraint();
  });

  describe('validate', () => {
    it('should return true if value is a valid CPF', () => {
      const value = '17339158502';
      const args = { object: { documento: value } } as ValidationArguments;

      const result = constraint.validate(value, args);

      expect(result).toBe(true);
    });

    it('should return true if value is a valid CNPJ', () => {
      const value = '01455040000190';
      const args = { object: { documento: value } } as ValidationArguments;

      const result = constraint.validate(value, args);

      expect(result).toBe(true);
    });

    it('should return false if value is not a valid CPF or CNPJ', () => {
      const value = '12345678900';
      const args = { object: { documento: value } } as ValidationArguments;

      const result = constraint.validate(value, args);

      expect(result).toBe(false);
    });

    it('should return false if value contains non-numeric characters', () => {
      const value = '123.abc.789-09';
      const args = { object: { documento: value } } as ValidationArguments;

      const result = constraint.validate(value, args);

      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the error message for invalid CPF or CNPJ', () => {
      const value = '12345678900';
      const args = { object: { documento: value } } as ValidationArguments;
      constraint.validate(value, args);

      const result = constraint.defaultMessage();

      expect(result).toBe('Documento deve ser um CPF ou CNPJ válido.');
    });
  });
});
