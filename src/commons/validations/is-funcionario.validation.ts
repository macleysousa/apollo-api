import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';

import { FuncionarioService } from 'src/modules/funcionario/funcionario.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class FuncionarioConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: FuncionarioService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    const { value } = _validationArguments;
    return `Funcionário "${value}" não encontrado`;
  }
}

export const IsFuncionario = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: FuncionarioConstraint,
    });
  };
};
