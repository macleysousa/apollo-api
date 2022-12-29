import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { IsBranch } from 'src/commons/validations/branch.validation';

import { IsUserNameValid } from 'src/modules/user/validations/is-username.validation';

export class LoginDTO {
    @IsNotEmpty()
    @IsUserNameValid()
    @ApiProperty()
    @MinLength(3)
    username: string;

    @IsNotEmpty()
    @ApiProperty()
    @MinLength(3)
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsBranch()
    branchId?: number;
}
