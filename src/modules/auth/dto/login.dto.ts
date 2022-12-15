import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

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
}
