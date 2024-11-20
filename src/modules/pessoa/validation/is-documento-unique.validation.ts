import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';

import { PessoaService } from '../pessoa.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsDocumentoConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: PessoaService) {}

  async validate(value: string, args?: ValidationArguments): Promise<boolean> {
    const response = await this.service.findByDocumento(value);

    return !response ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return `Documento já vinculado a outra pessoa`;
  }
}

export const IsDocumentoUnique = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: IsDocumentoConstraint,
    });
  };
};
