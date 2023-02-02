import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { ReferenceService } from 'src/modules/reference/reference.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ReferenceConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: ReferenceService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'reference is not valid';
  }
}

export const IsReference = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: ReferenceConstraint,
    });
  };
};
