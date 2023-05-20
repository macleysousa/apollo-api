import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { ApiComponent } from '../componente/decorator/componente.decorator';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-category.dto';
import { UpdateCategoriaDto } from './dto/update-category.dto';
import { CategoriaEntity } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
@ApiBearerAuth()
@ApiComponent('PRDFM004', 'Manutenção da categoria do produto')
export class CategoriaController {
  constructor(private readonly categoryService: CategoriaService) {}

  @Post()
  @ApiResponse({ status: 201, type: CategoriaEntity })
  async create(@Body() createCategoryDto: CreateCategoriaDto): Promise<CategoriaEntity> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, type: [CategoriaEntity] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async find(@Query('name') name?: string, @Query('active') active?: unknown): Promise<CategoriaEntity[]> {
    return this.categoryService.find(name, active);
  }

  @Get(':id')
  @IsPublic()
  @ApiResponse({ status: 200, type: CategoriaEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CategoriaEntity> {
    return this.categoryService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: CategoriaEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoriaDto): Promise<CategoriaEntity> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
