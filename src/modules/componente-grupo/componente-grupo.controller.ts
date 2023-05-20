import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../componente/decorator/componente.decorator';
import { ComponenteGrupoService } from './componente-grupo.service';
import { CreateComponenteGrupoDto } from './dto/criar-componente-grupo.dto';
import { UpdateComponentGroupDto } from './dto/atualizar-componente-grupo.dto';
import { ComponenteGrupoEntity } from './entities/componente-grupo.entity';

@ApiTags('Component Groups')
@Controller('component/groups')
@ApiBearerAuth()
@ApiComponent('ADMFM002', 'Manutenção do grupo de acesso')
export class ComponenteGrupoController {
  constructor(private readonly service: ComponenteGrupoService) {}

  @Post()
  @ApiResponse({ type: ComponenteGrupoEntity, status: 201 })
  async create(@Body() createComponentGroupDto: CreateComponenteGrupoDto): Promise<ComponenteGrupoEntity> {
    return this.service.create(createComponentGroupDto);
  }

  @Get()
  @ApiResponse({ type: [ComponenteGrupoEntity], status: 200 })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  async find(@Query('name') name: string): Promise<ComponenteGrupoEntity[]> {
    return this.service.find(name);
  }

  @Get(':id')
  @ApiResponse({ type: ComponenteGrupoEntity, status: 200 })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ComponenteGrupoEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ type: ComponenteGrupoEntity, status: 200 })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComponentGroupDto: UpdateComponentGroupDto
  ): Promise<ComponenteGrupoEntity> {
    return this.service.update(id, updateComponentGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
