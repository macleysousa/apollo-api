import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';

import { MarcaService } from 'src/modules/marca/marca.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class MarcaConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: MarcaService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Marca não encontrada';
  }
}

export const IsMarca = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: MarcaConstraint,
    });
  };
};
