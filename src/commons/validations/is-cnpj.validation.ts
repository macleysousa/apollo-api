import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsCnpjValidConstraint implements ValidatorConstraintInterface {
  calculateDigitVerifier(cnpj: string, weights: number[]): string {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cnpj[i]) * weights[i];
    }

    const modulo = sum % 11;
    const result = modulo < 2 ? 0 : 11 - modulo;
    return result.toString();
  }

  async validate(value: string): Promise<boolean> {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    const cnpj = value.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    const digit1 = this.calculateDigitVerifier(cnpj.substring(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const digit2 = this.calculateDigitVerifier(cnpj.substring(0, 12) + digit1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return cnpj[12] === digit1 && cnpj[13] === digit2 && regex.test(value);
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'cnpj is incorrect or in an invalid format';
  }
}

export const IsCnpjValid = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: IsCnpjValidConstraint,
    });
  };
};
