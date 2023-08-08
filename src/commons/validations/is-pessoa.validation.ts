import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PessoaService } from 'src/modules/pessoa/pessoa.service';

@Injectable()
@ValidatorConstraint({ async: false })
export class IsPessoaConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: PessoaService) {}

  async validate(value: number): Promise<boolean> {
    const pessoa = await this.service.findById(value);

    return pessoa ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    const { value } = _validationArguments;
    return `Pessoa com id ${value} não encontrada`;
  }
}

export function IsPessoa(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPessoa',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPessoaConstraint,
    });
  };
}
