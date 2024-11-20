import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { AdicionarUsuarioGrupoDto } from './dto/adicionar-usuario-grupo.dto';
import { UsuarioGrupoEntity } from './entities/grupo-acesso.entity';
import { UsuarioGrupoService } from './grupo-acesso.service';

@ApiTags('Usuários Grupos')
@Controller('usuario/:id/grupo-acesso')
@ApiBearerAuth()
@ApiComponent('ADMFM005', 'Relacionar usuário ao grupo de acessos')
export class UsuarioGrupoController {
  constructor(private readonly groupAccessService: UsuarioGrupoService) {}

  @Post()
  @ApiResponse({ type: UsuarioGrupoEntity, status: 201 })
  async add(
    @Param('id', ParseIntPipe) id: number,
    @Body() createGroupAccessDto: AdicionarUsuarioGrupoDto,
  ): Promise<UsuarioGrupoEntity> {
    return this.groupAccessService.add(id, createGroupAccessDto);
  }

  @Get()
  async find(@Param('id', ParseIntPipe) id: number): Promise<UsuarioGrupoEntity[]> {
    return this.groupAccessService.find(id);
  }

  @Get(':empresaId')
  async findByBranchId(
    @Param('id', ParseIntPipe) id: number,
    @Param('empresaId', ParseIntPipe) empresaId: number,
  ): Promise<UsuarioGrupoEntity[]> {
    return this.groupAccessService.findByBranchId(id, empresaId);
  }

  @Get(':empresaId/:grupoId')
  async findByBranchIdAndGroupId(
    @Param('id', ParseIntPipe) id: number,
    @Param('empresaId', ParseIntPipe) empresaId: number,
    @Param('grupoId', ParseIntPipe) grupoId: number,
  ): Promise<UsuarioGrupoEntity> {
    return this.groupAccessService.findByBranchIdAndGroupId(id, empresaId, grupoId);
  }

  @Delete(':empresaId/:grupoId')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('empresaId', ParseIntPipe) empresaId: number,
    @Param('grupoId', ParseIntPipe) grupoId: number,
  ): Promise<void> {
    this.groupAccessService.remove(id, empresaId, grupoId);
  }
}
