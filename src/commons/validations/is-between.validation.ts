import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsBetweenConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [min, max] = args.constraints;
    return value >= min && value <= max;
  }

  defaultMessage(args: ValidationArguments) {
    const [min, max] = args.constraints;
    return `The value must be between ${min} and ${max}`;
  }
}

export function IsBetween(min: number, max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBetween',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: IsBetweenConstraint,
    });
  };
}
