import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiPessoa } from 'src/decorators/api-pessoa.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { LoginPessoaUsuarioDto } from './dto/login-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioService } from './pessoa-usuario.service';
import { LoginResponse } from './responses/login.response';

@ApiTags('Pessoas - Usuários')
@Controller('pessoas-usuarios')
@ApiBearerAuth()
@ApiPessoa()
export class PessoaUsuarioController {
  constructor(private readonly service: PessoaUsuarioService) {}

  @Post('registrar')
  @ApiResponse({ status: 201, type: String })
  @IsPublic()
  async registry(@Body() dto: CreatePessoaUsuarioDto): Promise<string> {
    return this.service.register(dto);
  }

  @Post('login')
  @ApiResponse({ status: 201, type: LoginResponse })
  @IsPublic()
  async login(@Body() dto: LoginPessoaUsuarioDto): Promise<LoginResponse> {
    return this.service.login(dto);
  }

  @Get('perfil')
  @ApiResponse({ status: 200, type: PessoaUsuario })
  async findPerfil(@Request() request: any): Promise<PessoaUsuario> {
    return this.service.findPerfil(request.token);
  }
}
