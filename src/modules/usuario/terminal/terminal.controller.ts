import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseUsuarioPipe } from 'src/commons/pipes/parseUsuario.pipe';
import { ApiComponent } from 'src/modules/componente/decorator/componente.decorator';
import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

import { AddUsuarioTerminalDto } from './dto/add-terminal.dto';
import { UsuarioTerminalService } from './terminal.service';

@ApiTags('Usuários Terminais')
@Controller('usuarios/:usuarioId/terminais')
@ApiBearerAuth()
@ApiComponent('ADMFM007', 'Manutenção de terminais do usuário')
export class UsuarioTerminalController {
  constructor(private readonly service: UsuarioTerminalService) {}

  @Post()
  @ApiResponse({ status: 201, type: TerminalEntity })
  async add(
    @Param('usuarioId', ParseUsuarioPipe) usuarioId: number,
    @Body() addTerminalDto: AddUsuarioTerminalDto
  ): Promise<TerminalEntity> {
    return this.service.add(usuarioId, addTerminalDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [TerminalEntity] })
  async find(@Param('usuarioId', ParseUsuarioPipe) usuarioId: number): Promise<TerminalEntity[]> {
    return this.service.find(usuarioId);
  }

  @Get(':empresaId')
  @ApiResponse({ status: 200, type: [TerminalEntity] })
  async findByEmpresaId(
    @Param('usuarioId', ParseUsuarioPipe) usuarioId: number,
    @Param('empresaId') empresaId: number
  ): Promise<TerminalEntity[]> {
    return this.service.findByEmpresaId(usuarioId, empresaId);
  }

  @Delete(':terminalId')
  @ApiResponse({ status: 200 })
  async delete(@Param('usuarioId', ParseUsuarioPipe) usuarioId: number, @Param('terminalId') terminalId: number): Promise<void> {
    await this.service.delete(usuarioId, terminalId);
  }
}
