import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserNameValidConstraint implements ValidatorConstraintInterface {
    async validate(name: string): Promise<boolean> {
        if (new RegExp('^([a-z0-9,-]{4,})$').test(name)) {
            return true;
        }

        return false;
    }

    defaultMessage(_validationArguments?: ValidationArguments): string {
        return 'invalid name format';
    }
}

export const IsUserNameValid = (validationOptions?: ValidationOptions) => {
    return (object: unknown, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [object],
            validator: IsUserNameValidConstraint,
        });
    };
};
