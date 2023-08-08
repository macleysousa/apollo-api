import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

import { TabelaDePrecoService } from 'src/modules/tabela-de-preco/tabela-de-preco.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class TabelaDePrecoConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: TabelaDePrecoService) {}

  async validate(value: number): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Tabela de preço não encontrada';
  }
}

export const IsTabelaDePreco = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: TabelaDePrecoConstraint,
    });
  };
};
