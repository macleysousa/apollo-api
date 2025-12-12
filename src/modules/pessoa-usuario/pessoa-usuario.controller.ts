import { Body, Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiPessoa } from 'src/decorators/api-pessoa.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { ChangePasswordDto } from './dto/change-password.dto';
import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginPessoaUsuarioDto } from './dto/login-pessoa-usuario.dto';
import { RequestResetCodeDto } from './dto/request-reset-code.dto';
import { ResetPasswordWithCodeDto } from './dto/reset-password-with-code.dto';
import { UpdatePessoaUsuarioDto } from './dto/update-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioService } from './pessoa-usuario.service';
import { LoginResponse } from './responses/login.response';
import { PasswordResetResponse } from './responses/password-reset.response';
import { ResetCodeResponse } from './responses/reset-code.response';
import { SaldoPontoResponse } from './responses/saldo-ponto.response';
import { VerifyResponse } from './responses/verify.response';

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
  async findPerfil(): Promise<PessoaUsuario> {
    return this.service.findPerfil();
  }

  @Put('perfil')
  @ApiResponse({ status: 200, type: PessoaUsuario })
  async updatePerfil(@Body() dto: UpdatePessoaUsuarioDto): Promise<PessoaUsuario> {
    return this.service.updatePerfil(dto);
  }

  @Put('perfil/alterar-senha')
  @ApiResponse({ status: 200, type: PasswordResetResponse })
  async changePassword(@Body() dto: ChangePasswordDto): Promise<PasswordResetResponse> {
    return this.service.changePassword(dto);
  }

  @Get('verificar-documento/:documento')
  @ApiResponse({ status: 200, type: VerifyResponse })
  @IsPublic()
  async verifyDocument(@Param('documento') documento: string): Promise<VerifyResponse> {
    return this.service.verifyDocument(documento);
  }

  @Get('verificar-email/:email')
  @ApiResponse({ status: 200, type: VerifyResponse })
  @IsPublic()
  async verifyEmail(@Param('email') email: string): Promise<VerifyResponse> {
    return this.service.verifyEmail(email);
  }

  @Post('esqueci-senha')
  @ApiResponse({ status: 201, type: PasswordResetResponse })
  @IsPublic()
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<PasswordResetResponse> {
    return this.service.forgotPassword(dto);
  }

  @Post('solicitar-redefinir-senha')
  @ApiResponse({ status: 201, type: ResetCodeResponse })
  @IsPublic()
  async requestResetCode(@Body() dto: RequestResetCodeDto): Promise<ResetCodeResponse> {
    return this.service.requestResetCode(dto);
  }

  @Post('redefinir-senha')
  @ApiResponse({ status: 201, type: PasswordResetResponse })
  @IsPublic()
  async resetPassword(@Body() dto: ResetPasswordWithCodeDto): Promise<PasswordResetResponse> {
    return this.service.resetPasswordWithCode(dto);
  }

  @Get('saldo-pontos')
  @ApiResponse({ status: 200, type: SaldoPontoResponse })
  async getSaldoPontos(): Promise<SaldoPontoResponse> {
    return this.service.getSaldoPontos();
  }
}
