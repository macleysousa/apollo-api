import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';

import { CategoriaService } from 'src/modules/categoria/categoria.service';
import { SubCategoriaService } from 'src/modules/categoria/sub/sub.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class SubCategoriaConstraint implements ValidatorConstraintInterface {
  private errorMessage: string;

  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly subCategoriaService: SubCategoriaService,
  ) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const { categoriaId }: any = args.object;

    if (!categoriaId) return false;

    const category = await this.categoriaService.findById(categoriaId);

    if (!category) {
      this.errorMessage = 'Categoria não encontrada';
      return false;
    }

    const subCategory = await this.subCategoriaService.findById(undefined, value);
    if (!subCategory) {
      this.errorMessage = 'SubCategoria não encontrada';
      return false;
    }

    return true;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this.errorMessage || 'category or sub category is not valid';
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
