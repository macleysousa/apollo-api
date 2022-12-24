import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../component/component.decorator';
import { ComponentGroupItemService } from './component-group-item.service';
import { AddComponentGroupItemDto } from './dto/create-component-group-item.dto';
import { ComponentGroupItemEntity } from './entities/component-group-item.entity';

@ApiTags('Component Group Items')
@Controller('component/group/:id/items')
@ApiBearerAuth()
@ApiComponent('ADMFM003', 'Relacionar componente ao grupo de acesso')
export class ComponentGroupItemController {
    constructor(private readonly service: ComponentGroupItemService) {}

    @Post()
    @ApiResponse({ type: ComponentGroupItemEntity, status: 201 })
    async add(
        @Param('id', ParseIntPipe) id: number,
        @Body() createComponentGroupItemDto: AddComponentGroupItemDto
    ): Promise<ComponentGroupItemEntity[]> {
        return this.service.add(id, createComponentGroupItemDto);
    }

    @Get()
    @ApiResponse({ type: [ComponentGroupItemEntity], status: 200 })
    async findByGroup(@Param('id', ParseIntPipe) id: number): Promise<ComponentGroupItemEntity[]> {
        return this.service.findByGroup(id);
    }

    @Get('/:component')
    @ApiResponse({ type: ComponentGroupItemEntity, status: 200 })
    async findByComponent(@Param('id', ParseIntPipe) id: number, @Param('component') component: string): Promise<ComponentGroupItemEntity> {
        return this.service.findByComponent(id, component);
    }

    @Delete('/:component')
    async remove(@Param('id', ParseIntPipe) id: number, @Param('component') component: string): Promise<void> {
        return this.service.remove(id, component);
    }
}
