import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, MaxLength, MinLength } from 'class-validator';

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
    @MaxLength(20)
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty({ enum: Role, default: Role.DEFAULT })
    role: Role;

    @IsNotEmpty()
    @ApiProperty({ enum: UserStatus, default: UserStatus.RELEASED })
    status: UserStatus;
}
