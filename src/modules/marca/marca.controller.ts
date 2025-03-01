import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IsPublic } from 'src/decorators/is-public.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaEntity } from './entities/marca.entity';
import { MarcaService } from './marca.service';

@ApiTags('Marcas')
@Controller('marcas')
@ApiBearerAuth()
@ApiComponent('PRDFM006', 'Manutenção de marca do produto')
export class MarcaController {
  constructor(private readonly service: MarcaService) {}

  @Post()
  @ApiResponse({ status: 201, type: MarcaEntity })
  async create(@Body() createBrandDto: CreateMarcaDto): Promise<MarcaEntity> {
    return this.service.create(createBrandDto);
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, type: [MarcaEntity] })
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'inativa', required: false, type: Boolean })
  async find(@Query('nome') nome?: string, @Query('inativa') inativa?: unknown): Promise<MarcaEntity[]> {
    return this.service.find(nome, inativa);
  }

  @Get(':id')
  @IsPublic()
  @ApiResponse({ status: 200, type: MarcaEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<MarcaEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: MarcaEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBrandDto: UpdateMarcaDto): Promise<MarcaEntity> {
    return this.service.update(id, updateBrandDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
