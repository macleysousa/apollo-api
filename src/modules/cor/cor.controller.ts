import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from '../componente/decorator/componente.decorator';

import { CorService } from './cor.service';
import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';
import { CorEntity } from './entities/cor.entity';

@ApiTags('Cores')
@Controller('cores')
@ApiBearerAuth()
@ApiComponent('PRDFM001', 'Manutenção de cor de produto')
export class CorController {
  constructor(private readonly service: CorService) {}

  @Post()
  @ApiResponse({ type: CorEntity, status: 201 })
  async create(@Body() createColorDto: CreateCorDto): Promise<CorEntity> {
    return this.service.create(createColorDto);
  }

  @Get()
  @ApiResponse({ type: [CorEntity], status: 200 })
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'inativa', required: false, type: Boolean })
  async find(@Query('nome') nome?: string, @Query('inativa') inativa?: boolean | unknown): Promise<CorEntity[]> {
    return this.service.find(nome, inativa);
  }

  @Get(':id')
  @ApiResponse({ type: CorEntity, status: 200 })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CorEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ type: CorEntity, status: 200 })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateColorDto: UpdateCorDto): Promise<CorEntity> {
    return this.service.update(id, updateColorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
