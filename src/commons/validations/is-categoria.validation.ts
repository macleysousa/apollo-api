import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { CategoriaService } from 'src/modules/categoria/categoria.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoriaConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: CategoriaService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Categoria não encontrada';
  }
}

export const IsCategoria = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: CategoriaConstraint,
    });
  };
};
