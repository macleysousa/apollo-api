import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { MarcaService } from 'src/modules/marca/marca.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class BrandConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: MarcaService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'brand is not valid';
  }
}

export const IsBrand = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: BrandConstraint,
    });
  };
};
