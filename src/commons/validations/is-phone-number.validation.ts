import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Decorator customizado para validar e normalizar número de telefone brasileiro.
 * Aceita apenas caracteres: dígitos, parênteses, hífen e espaço.
 * Exemplo de uso:
 *
 * @IsPhoneNumber({ message: 'Número de telefone inválido' })
 * valor: string;
 */
@Injectable()
@ValidatorConstraint({ async: true })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') return false;

    // Remove tudo exceto dígitos
    let digits = value.replace(/\D/g, '');

    // Aceita números internacionais: mínimo 10 dígitos, máximo 15
    if (digits.length < 10 || digits.length > 15) return false;

    // Se não começa com código do país (dois dígitos), adiciona '55'
    if (digits.length === 10 || digits.length === 11) {
      digits = '55' + digits;
    }

    args.object[args.property] = digits;
    return true;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Número de telefone inválido. Use apenas dígitos, parênteses, hífen e espaço. Ex: (61) 98234-1371';
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsPhoneNumberConstraint,
    });
  };
}
