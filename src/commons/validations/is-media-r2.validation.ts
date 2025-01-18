import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { getR2Url } from 'src/helpers/r2';
import { StorageService } from 'src/storage/storage.service';

@ValidatorConstraint({ async: true })
export class MediaR2Constraint implements ValidatorConstraintInterface {
  messageError: string;

  constructor(private readonly service: StorageService) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    if (!value) {
      args.object[args.property] = undefined;
      return true;
    }

    const url = getR2Url('string').replace('string', '');
    args.object[args.property] = value.replace(url, '');

    return this.service.exists(args.object[args.property]);
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return this?.messageError ?? 'Invalid media url or not exists';
  }
}

export const IsMediaR2 = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [object],
      validator: MediaR2Constraint,
    });
  };
};
