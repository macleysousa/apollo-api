import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { CategoriaService } from 'src/modules/categoria/categoria.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoryConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: CategoriaService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'category is not valid';
  }
}

export const IsCategory = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: CategoryConstraint,
    });
  };
};
