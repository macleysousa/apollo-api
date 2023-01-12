import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserNameValidConstraint implements ValidatorConstraintInterface {
  async validate(username: string): Promise<boolean> {
    return new RegExp('^([a-z0-9,-]{3,})$').test(username);
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'invalid name format';
  }
}

export const IsUserNameValid = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: IsUserNameValidConstraint,
    });
  };
};
