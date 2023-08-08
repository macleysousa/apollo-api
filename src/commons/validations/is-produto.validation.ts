import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ProdutoService } from 'src/modules/produto/produto.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class ProdutoConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: ProdutoService) {}

  async validate(value: number): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Produto não encontrado';
  }
}

export const IsProduto = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: ProdutoConstraint,
    });
  };
};
