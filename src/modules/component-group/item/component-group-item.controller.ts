import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Component } from '../../component/component.decorator';
import { ComponentGroupItemService } from './component-group-item.service';
import { CreateComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponentGroupItemEntity } from './entities/component-group-item.entity';

@ApiTags('Component Group Items')
@Controller('component/group/:id/items')
@ApiBearerAuth()
@Component('ADMFM003', 'Relacionar componente ao grupo de acesso')
export class ComponentGroupItemController {
    constructor(private readonly service: ComponentGroupItemService) {}

    @Post()
    async add(
        @Param('id') id: number,
        @Body() createComponentGroupItemDto: CreateComponentGroupItemDto
    ): Promise<ComponentGroupItemEntity[]> {
        return this.service.add(id, createComponentGroupItemDto);
    }

    @Get()
    async findByGroup(@Param('id') id: number): Promise<ComponentGroupItemEntity[]> {
        return this.service.findByGroup(id);
    }

    @Get('/:component')
    async findByComponent(@Param('id') id: number, @Param('component') component: string): Promise<ComponentGroupItemEntity> {
        return this.service.findByComponent(id, component);
    }

    @Delete('/:component')
    async remove(@Param('id') id: number, @Param('component') component: string): Promise<void> {
        return this.service.remove(id, component);
    }
}
