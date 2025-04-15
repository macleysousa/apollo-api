import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsDateOnlyConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateOnlyRegex.test(value)) {
      return false;
    }

    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime()) && value === date.toISOString().split('T')[0];
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'O valor deve ser uma data válida no formato YYYY-MM-DD.';
  }
}

export function IsDateOnly(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateOnlyConstraint,
    });
  };
}
