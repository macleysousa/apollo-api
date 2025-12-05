import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';

export function isCNPJ(value: string): boolean {
  const _value = value?.replace(/\D/g, '');
  return cnpj.isValid(_value);
}

export function isCPF(value: string): boolean {
  const _value = value?.replace(/\D/g, '');
  return cpf.isValid(_value);
}

export function isValidDocument(value: string): boolean {
  const _value = value?.replace(/\D/g, '');
  return isCPF(_value) || isCNPJ(_value);
}

@Injectable()
@ValidatorConstraint({ async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  messageError: string;

  validate(value: string, args: ValidationArguments): boolean {
    const _value = value?.replace(/\D/g, '');

    if (!isValidDocument(_value)) {
      this.messageError = 'Documento deve ser um CPF ou CNPJ válido.';
      return false;
    }

    args.object[args.property] = _value;

    return true;
  }

  defaultMessage() {
    return this.messageError;
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDocumentConstraint,
    });
  };
}
