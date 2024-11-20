import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-category.dto';
import { UpdateCategoriaDto } from './dto/update-category.dto';
import { CategoriaEntity } from './entities/category.entity';

@ApiTags('Categorias')
@Controller('categorias')
@ApiBearerAuth()
@ApiComponent('PRDFM004', 'Manutenção da categoria do produto')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Post()
  @ApiResponse({ status: 201, type: CategoriaEntity })
  async create(@Body() createCategoryDto: CreateCategoriaDto): Promise<CategoriaEntity> {
    return this.service.create(createCategoryDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [CategoriaEntity] })
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'inativa', required: false, type: Boolean })
  async find(@Query('nome') nome?: string, @Query('inativa') inativa?: unknown): Promise<CategoriaEntity[]> {
    return this.service.find(nome, inativa);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: CategoriaEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CategoriaEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: CategoriaEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoriaDto): Promise<CategoriaEntity> {
    return this.service.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
