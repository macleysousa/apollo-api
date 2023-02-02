import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { MeasurementUnitService } from 'src/modules/measurement-unit/measurement-unit.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class MeasurementUnitConstraint implements ValidatorConstraintInterface {
  constructor(private readonly service: MeasurementUnitService) {}

  async validate(value: number, args?: ValidationArguments): Promise<boolean> {
    return (await this.service.findById(value)) ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'measurement unit is not valid';
  }
}

export const IsMeasurementUnit = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: MeasurementUnitConstraint,
    });
  };
};
