import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ComponentService } from '../component.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsComponentValidConstraint implements ValidatorConstraintInterface {
  constructor(private readonly componentService: ComponentService) {}
  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const component = await this.componentService.findById(value);

    return component ? true : false;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Component does not exist';
  }
}

export const IsComponentValid = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: IsComponentValidConstraint,
    });
  };
};
