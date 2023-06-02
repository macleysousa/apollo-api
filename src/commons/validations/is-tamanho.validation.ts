import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { TamanhoService } from 'src/modules/tamanho/tamanho.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class TamanhoConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: TamanhoService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'size is not valid';
  }
}

export const IsTamanho = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: TamanhoConstraint,
    });
  };
};
