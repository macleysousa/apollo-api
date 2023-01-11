import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../component/component.decorator';

import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorEntity } from './entities/color.entity';

@ApiTags('Colors')
@Controller('colors')
@ApiBearerAuth()
@ApiComponent('PRDFM001', 'Manutenção de cor de produto')
export class ColorController {
    constructor(private readonly colorService: ColorService) {}

    @Post()
    @ApiResponse({ type: ColorEntity, status: 201 })
    async create(@Body() createColorDto: CreateColorDto): Promise<ColorEntity> {
        return this.colorService.create(createColorDto);
    }

    @Get()
    @ApiResponse({ type: [ColorEntity], status: 200 })
    @ApiQuery({ name: 'name', required: false })
    @ApiQuery({ name: 'active', required: false, type: Boolean })
    async find(@Query('name') name?: string, @Query('active') active?: boolean | unknown): Promise<ColorEntity[]> {
        return this.colorService.find(name, active);
    }

    @Get(':id')
    @ApiResponse({ type: ColorEntity, status: 200 })
    async findById(@Param('id', ParseIntPipe) id: number): Promise<ColorEntity> {
        return this.colorService.findById(id);
    }

    @Put(':id')
    @ApiResponse({ type: ColorEntity, status: 200 })
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateColorDto: UpdateColorDto): Promise<ColorEntity> {
        return this.colorService.update(id, updateColorDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.colorService.remove(id);
    }
}
