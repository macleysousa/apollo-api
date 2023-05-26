import { ValidationArguments } from 'class-validator';
import { IsBetweenConstraint } from './is-between.validation';

describe('IsBetweenConstraint', () => {
  let constraint: IsBetweenConstraint;

  beforeEach(() => {
    constraint = new IsBetweenConstraint();
  });

  describe('validate', () => {
    it('should return true if value is between min and max', () => {
      const value = 5;
      const args: ValidationArguments = {
        constraints: [1, 10],
        value: undefined,
        targetName: '',
        object: undefined,
        property: '',
      };

      const result = constraint.validate(value, args);

      expect(result).toBe(true);
    });

    it('should return false if value is less than min', () => {
      const value = 0;
      const args: ValidationArguments = {
        constraints: [1, 10],
        value: undefined,
        targetName: '',
        object: undefined,
        property: '',
      };

      const result = constraint.validate(value, args);

      expect(result).toBe(false);
    });

    it('should return false if value is greater than max', () => {
      const value = 11;
      const args: ValidationArguments = {
        constraints: [1, 10],
        value: undefined,
        targetName: '',
        object: undefined,
        property: '',
      };

      const result = constraint.validate(value, args);

      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const args: ValidationArguments = {
        constraints: [1, 10],
        value: undefined,
        targetName: '',
        object: undefined,
        property: '',
      };

      const result = constraint.defaultMessage(args);

      expect(result).toBe('The value must be between 1 and 10');
    });
  });
});
