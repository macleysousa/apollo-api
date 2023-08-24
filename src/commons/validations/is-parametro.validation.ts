import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ParametroService } from 'src/modules/parametro/parametro.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class ParametroConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: ParametroService) {}

  async validate(value: string): Promise<boolean> {
    const response = await this.service.findById(value as any);

    return response ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Parâmetro não encontrado';
  }
}

export const IsParametro = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: ParametroConstraint,
    });
  };
};
