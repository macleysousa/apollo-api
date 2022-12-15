import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { TokenDTO } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private userService: UserService) {}

    @IsPublic()
    @Post('/signIn')
    @ApiOkResponse({ type: TokenDTO })
    async login(@Body() loginDto: LoginDTO): Promise<TokenDTO> {
        return this.authService.login(loginDto);
    }
}
