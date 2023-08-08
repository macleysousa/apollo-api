import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { SubCategoriaService } from 'src/modules/categoria/sub/sub.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class SubCategoriaConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: SubCategoriaService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const { categoryId }: any = args.object;

    if (!categoryId) return false;

    return (await this.service.findById(categoryId, value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'category or sub category is not valid';
  }
}

export const IsSubCategoria = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: SubCategoriaConstraint,
    });
  };
};
