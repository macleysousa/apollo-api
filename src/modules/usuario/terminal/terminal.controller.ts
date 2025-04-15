import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseUsuarioPipe } from 'src/commons/pipes/parseUsuario.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { AddUsuarioTerminalDto } from './dto/add-terminal.dto';
import { UsuarioTerminalService } from './terminal.service';
import { UsuarioTerminalView } from './views/terminal.view';

@ApiTags('Usuários Terminais')
@Controller('usuarios/:usuarioId/terminais')
@ApiBearerAuth()
@ApiComponent('ADMFM007', 'Manutenção de terminais do usuário')
export class UsuarioTerminalController {
  constructor(private readonly service: UsuarioTerminalService) {}

  @Post()
  @ApiResponse({ status: 201, type: UsuarioTerminalView })
  async add(
    @Param('usuarioId', ParseUsuarioPipe) usuarioId: number,
    @Body() addTerminalDto: AddUsuarioTerminalDto,
  ): Promise<UsuarioTerminalView> {
    return this.service.add(usuarioId, addTerminalDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [UsuarioTerminalView] })
  async find(@Param('usuarioId', ParseUsuarioPipe) usuarioId: number): Promise<UsuarioTerminalView[]> {
    return this.service.find(usuarioId);
  }

  @Get(':empresaId')
  @ApiResponse({ status: 200, type: [UsuarioTerminalView] })
  async findByEmpresaId(
    @Param('usuarioId', ParseUsuarioPipe) usuarioId: number,
    @Param('empresaId') empresaId: number,
  ): Promise<UsuarioTerminalView[]> {
    return this.service.findByEmpresaId(usuarioId, empresaId);
  }

  @Delete(':terminalId')
  @ApiResponse({ status: 200 })
  async delete(@Param('usuarioId', ParseUsuarioPipe) usuarioId: number, @Param('terminalId') terminalId: number): Promise<void> {
    await this.service.delete(usuarioId, terminalId);
  }
}
