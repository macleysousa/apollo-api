import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../componente/decorator/componente.decorator';
import { ComponenteGrupoItemService } from './componente-grupo-item.service';
import { AddComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponenteGrupoItemEntity } from './entities/componente-grupo-item.entity';

@ApiTags('Component Group Items')
@Controller('component/group/:id/items')
@ApiBearerAuth()
@ApiComponent('ADMFM003', 'Relacionar componente ao grupo de acesso')
export class ComponenteGrupoItemController {
  constructor(private readonly service: ComponenteGrupoItemService) {}

  @Post()
  @ApiResponse({ type: ComponenteGrupoItemEntity, status: 201 })
  async add(
    @Param('id', ParseIntPipe) id: number,
    @Body() createComponentGroupItemDto: AddComponentGroupItemDto
  ): Promise<ComponenteGrupoItemEntity[]> {
    return this.service.add(id, createComponentGroupItemDto);
  }

  @Get()
  @ApiResponse({ type: [ComponenteGrupoItemEntity], status: 200 })
  async findByGroup(@Param('id', ParseIntPipe) id: number): Promise<ComponenteGrupoItemEntity[]> {
    return this.service.findByGroup(id);
  }

  @Get('/:component')
  @ApiResponse({ type: ComponenteGrupoItemEntity, status: 200 })
  async findByComponent(@Param('id', ParseIntPipe) id: number, @Param('component') component: string): Promise<ComponenteGrupoItemEntity> {
    return this.service.findByComponent(id, component);
  }

  @Delete('/:component')
  async remove(@Param('id', ParseIntPipe) id: number, @Param('component') component: string): Promise<void> {
    return this.service.remove(id, component);
  }
}
