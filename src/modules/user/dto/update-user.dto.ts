import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

import { Role } from '../enum/user-role.enum';
import { UserStatus } from '../enum/user-status';

export class UpdateUserDto {
    @IsOptional()
    @ApiProperty()
    @MinLength(3)
    password: string;

    @IsOptional()
    @ApiProperty()
    name: string;

    @IsOptional()
    @ApiProperty({ enum: Role })
    role: Role;

    @IsOptional()
    @ApiProperty({ enum: UserStatus })
    status: UserStatus;
}
