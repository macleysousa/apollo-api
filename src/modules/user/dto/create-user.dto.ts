import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

import { Role } from '../enum/user-role.enum';
import { UserStatus } from '../enum/user-status';
import { IsUserNameUnique } from '../validations/is-username-unique.validation';
import { IsUserNameValid } from '../validations/is-username.validation';

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsUserNameValid()
    @IsUserNameUnique()
    @MinLength(3)
    username: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(3)
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    role: Role;

    @IsNotEmpty()
    @ApiProperty()
    status: UserStatus;
}
