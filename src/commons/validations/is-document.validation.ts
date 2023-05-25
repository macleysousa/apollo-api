import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  messageError: string;

  validate(value: string) {
    if (value !== value.replace(/\D/g, '')) {
      this.messageError = 'Documento deve conter apenas números.';
      return false;
    }

    const isValid = cpf.isValid(value) || cnpj.isValid(value);
    if (!isValid) {
      this.messageError = 'Documento deve ser um CPF ou CNPJ válido.';
      return false;
    }

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
