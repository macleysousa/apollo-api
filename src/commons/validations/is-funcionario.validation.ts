import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

import { FuncionarioService } from 'src/modules/funcionario/funcionario.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class FuncionarioConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: FuncionarioService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Funcionário não encontrado';
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
