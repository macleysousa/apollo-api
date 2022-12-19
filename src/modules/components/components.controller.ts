import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ComponentsService } from './components.service';

import { ComponentEntity } from './entities/component.entity';

@ApiTags('Components')
@Controller('components')
@ApiBearerAuth()
export class ComponentsController {
    constructor(private readonly componentsService: ComponentsService) {}

    @Get()
    @ApiQuery({ name: 'filter', required: false })
    @ApiQuery({ name: 'blocked', required: false })
    async findAll(@Query('filter') filter: string, @Query('blocked') blocked: boolean): Promise<ComponentEntity[]> {
        return this.componentsService.find(filter, blocked);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ComponentEntity> {
        return this.componentsService.findById(id);
    }
}
