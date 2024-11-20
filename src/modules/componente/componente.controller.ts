import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ComponenteService } from './componente.service';
import { ComponenteEntity } from './entities/componente.entity';

@ApiTags('Componentes')
@Controller('componentes')
@ApiBearerAuth()
export class ComponenteController {
  constructor(private readonly componentsService: ComponenteService) {}

  @Get()
  @ApiResponse({ type: [ComponenteEntity], status: 200 })
  @ApiQuery({ name: 'filter', required: false })
  @ApiQuery({ name: 'blocked', required: false })
  async find(@Query('filter') filter: string, @Query('blocked') blocked: boolean): Promise<ComponenteEntity[]> {
    return this.componentsService.find(filter, blocked);
  }

  @Get(':id')
  @ApiResponse({ type: ComponenteEntity, status: 200 })
  async findById(@Param('id', ParseIntPipe) id: string): Promise<ComponenteEntity> {
    return this.componentsService.findById(id);
  }
}
