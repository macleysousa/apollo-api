import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

import { UserService } from '../user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserNameUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {}

    async validate(name: string, args: ValidationArguments): Promise<boolean> {
        const unique = await this.userService.findByUserName(name);

        if (!unique) {
            return true;
        }
        return false;
    }

    defaultMessage(_validationArguments?: ValidationArguments): string {
        return 'username is already in use';
    }
}

export const IsUserNameUnique = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [object],
            validator: IsUserNameUniqueConstraint,
        });
    };
};
