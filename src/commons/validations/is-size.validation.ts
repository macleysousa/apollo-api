import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { SizeService } from 'src/modules/size/size.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class SizeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: SizeService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'size is not valid';
  }
}

export const IsSize = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: SizeConstraint,
    });
  };
};
