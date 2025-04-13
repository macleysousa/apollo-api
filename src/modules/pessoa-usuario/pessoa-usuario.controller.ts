import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { IsPublic } from 'src/decorators/is-public.decorator';

import { CreatePessoaUsuarioDto } from './dto/create-pessoa-usuario.dto';
import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioService } from './pessoa-usuario.service';

@ApiTags('Pessoas - Usuários')
@Controller('pessoas-usuarios')
export class PessoaUsuarioController {
  constructor(private readonly service: PessoaUsuarioService) {}

  @Post('registrar')
  @ApiResponse({ status: 201, type: String })
  @IsPublic()
  async registry(@Body() dto: CreatePessoaUsuarioDto): Promise<string> {
    return this.service.register(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [PessoaUsuario] })
  async find(): Promise<PessoaUsuario[]> {
    return this.service.find();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: PessoaUsuario })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<PessoaUsuario> {
    return this.service.findById(id);
  }
}
