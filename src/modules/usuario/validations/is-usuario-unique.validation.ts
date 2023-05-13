import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

import { UsuarioService } from '../usuario.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsuarioConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsuarioService) {}

  async validate(name: string, args?: ValidationArguments): Promise<boolean> {
    const user = await this.userService.findByUserName(name);

    return !user ? true : false;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'username is already in use';
  }
}

export const IsUsuarioUnique = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: IsUsuarioConstraint,
    });
  };
};
