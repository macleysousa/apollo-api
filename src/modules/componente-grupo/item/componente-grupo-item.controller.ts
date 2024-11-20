import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../../decorators/api-componente.decorator';

import { ComponenteGrupoItemService } from './componente-grupo-item.service';
import { AddComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponenteGrupoItemEntity } from './entities/componente-grupo-item.entity';

@ApiTags('Componentes Grupos Itens')
@Controller('componentes/grupos/:id/itens')
@ApiBearerAuth()
@ApiComponent('ADMFM003', 'Relacionar componente ao grupo de acesso')
export class ComponenteGrupoItemController {
  constructor(private readonly service: ComponenteGrupoItemService) {}

  @Post()
  @ApiResponse({ type: ComponenteGrupoItemEntity, status: 201 })
  async add(
    @Param('id', ParseIntPipe) id: number,
    @Body() createComponentGroupItemDto: AddComponentGroupItemDto,
  ): Promise<ComponenteGrupoItemEntity[]> {
    return this.service.add(id, createComponentGroupItemDto);
  }

  @Get()
  @ApiResponse({ type: [ComponenteGrupoItemEntity], status: 200 })
  async findByGroup(@Param('id', ParseIntPipe) id: number): Promise<ComponenteGrupoItemEntity[]> {
    return this.service.findByGroup(id);
  }

  @Get('/:componente')
  @ApiResponse({ type: ComponenteGrupoItemEntity, status: 200 })
  async findByComponent(
    @Param('id', ParseIntPipe) id: number,
    @Param('componente') component: string,
  ): Promise<ComponenteGrupoItemEntity> {
    return this.service.findByComponent(id, component);
  }

  @Delete('/:componente')
  async remove(@Param('id', ParseIntPipe) id: number, @Param('componente') component: string): Promise<void> {
    return this.service.remove(id, component);
  }
}
