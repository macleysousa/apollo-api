import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from 'src/decorators/current-auth.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioAcessoEntity } from './entities/usuario-acessos.entity';
import { Role } from './enums/usuario-tipo.enum';
import { UsuarioService } from './usuario.service';

@ApiTags('Usuários')
@Controller('usuarios')
@ApiBearerAuth()
@ApiComponent('ADMFM001', 'Manutenção de usuário')
export class UsuarioController {
  constructor(private readonly userService: UsuarioService) {}

  @Post()
  @ApiResponse({ type: UsuarioEntity, status: 201 })
  async create(@CurrentUser() user: UsuarioEntity, @Body() createUserDto: CriarUsuarioDto): Promise<UsuarioEntity> {
    if (user.tipo != Role.sysadmin && createUserDto.tipo == Role.sysadmin) {
      throw new UnauthorizedException('Para criar o usuário do tipo sysadmin, você deve ter acesso sysadmin');
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ type: [UsuarioEntity], status: 200 })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  async find(@Query('name') name: string): Promise<UsuarioEntity[]> {
    return this.userService.find(name);
  }

  @Get(':id')
  @ApiResponse({ type: UsuarioEntity, status: 200 })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UsuarioEntity> {
    return this.userService.findById(id);
  }

  @Get(':id/acessos')
  @ApiResponse({ type: UsuarioAcessoEntity, isArray: true, status: 200 })
  @ApiQuery({ name: 'empresaId', required: false })
  @ApiQuery({ name: 'componente', required: false })
  async findAccesses(
    @Param('id', ParseIntPipe) id: number,
    @Query('empresaId') empresaId?: string,
    @Query('componente') componente?: string,
  ): Promise<UsuarioAcessoEntity[]> {
    return this.userService.findAccesses(id, { empresaId: empresaId ? Number(empresaId) : null, componenteId: componente });
  }

  @Put(':id')
  @ApiResponse({ type: UsuarioEntity, status: 200 })
  async update(
    @CurrentUser() user: UsuarioEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: AtualizarUsuarioDto,
  ): Promise<UsuarioEntity> {
    if (user.tipo != Role.sysadmin && updateUserDto.tipo == Role.sysadmin) {
      throw new UnauthorizedException('To update user to sysadmin you must have sysadmin access');
    }
    return this.userService.update(id, updateUserDto);
  }
}
