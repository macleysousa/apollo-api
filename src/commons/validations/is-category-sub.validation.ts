import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { SubCategoryService } from 'src/modules/category/sub/sub.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class SubCategoryConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: SubCategoryService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    const { categoryId }: any = args.object;

    if (!categoryId) return false;

    return (await this.service.findById(categoryId, value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'category or sub category is not valid';
  }
}

export const IsSubCategory = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: SubCategoryConstraint,
    });
  };
};
