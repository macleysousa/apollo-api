import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../component/component.decorator';
import { ComponentGroupService } from './component-group.service';
import { CreateComponentGroupDto } from './dto/create-component-group.dto';
import { UpdateComponentGroupDto } from './dto/update-component-group.dto';
import { ComponentGroupEntity } from './entities/component-group.entity';

@ApiTags('Component Groups')
@Controller('component/groups')
@ApiBearerAuth()
@ApiComponent('ADMFM002', 'Manutenção do grupo de acesso')
export class ComponentGroupController {
    constructor(private readonly service: ComponentGroupService) {}

    @Post()
    @ApiResponse({ type: ComponentGroupEntity, status: 201 })
    async create(@Body() createComponentGroupDto: CreateComponentGroupDto): Promise<ComponentGroupEntity> {
        return this.service.create(createComponentGroupDto);
    }

    @Get()
    @ApiResponse({ type: [ComponentGroupEntity], status: 200 })
    @ApiQuery({ name: 'name', type: 'string', required: false })
    async find(@Query('name') name: string): Promise<ComponentGroupEntity[]> {
        return this.service.find(name);
    }

    @Get(':id')
    @ApiResponse({ type: ComponentGroupEntity, status: 200 })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ComponentGroupEntity> {
        return this.service.findById(id);
    }

    @Put(':id')
    @ApiResponse({ type: ComponentGroupEntity, status: 200 })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateComponentGroupDto: UpdateComponentGroupDto
    ): Promise<ComponentGroupEntity> {
        return this.service.update(id, updateComponentGroupDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.service.remove(id);
    }
}
