import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { ApiComponent } from '../component/component.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
@ApiBearerAuth()
@ApiComponent('PRDFM004', 'Manutenção da categoria do produto')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiResponse({ status: 201, type: CategoryEntity })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, type: [CategoryEntity] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async find(@Query('name') name?: string, @Query('active') active?: unknown): Promise<CategoryEntity[]> {
    return this.categoryService.find(name, active);
  }

  @Get(':id')
  @IsPublic()
  @ApiResponse({ status: 200, type: CategoryEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CategoryEntity> {
    return this.categoryService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: CategoryEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
