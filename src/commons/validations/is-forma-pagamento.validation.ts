import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

import { FormaDePagamentoService } from 'src/modules/forma-de-pagamento/forma-de-pagamento.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class FormaPagamentoConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: FormaDePagamentoService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const forma = await this.service.findById(value);
    return forma ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Forma de pagamento não encontrada.';
  }
}

export const IsFormaPagamento = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: FormaPagamentoConstraint,
    });
  };
};
