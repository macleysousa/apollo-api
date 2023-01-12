import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { TokenDTO } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('/signIn')
  @ApiOkResponse({ type: TokenDTO })
  async login(@Body() loginDto: LoginDTO, @Response() res): Promise<any> {
    const { token, refreshToken } = await this.authService.login(loginDto);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.send({ token });
  }

  @IsPublic()
  @Post('/refresh')
  @ApiOkResponse({ type: TokenDTO })
  async refreshToken(@Body() { refreshToken }: RefreshTokenDTO): Promise<any> {
    return this.authService.refreshToken(refreshToken);
  }
}
