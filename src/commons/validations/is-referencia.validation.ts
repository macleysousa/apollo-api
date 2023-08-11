import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { ReferenciaService } from 'src/modules/referencia/referencia.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class ReferenciaConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: ReferenciaService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments: ValidationArguments): string {
    return `Referência "${_validationArguments.value}" não encontrada`;
  }
}

export const IsReferencia = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: ReferenciaConstraint,
    });
  };
};
