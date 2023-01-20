import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { ApiComponent } from '../component/component.decorator';

import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandEntity } from './entities/brand.entity';

@ApiTags('Brands')
@Controller('brands')
@ApiComponent('PRDFM006', 'Manutenção de marca do produto')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Post()
  @ApiResponse({ status: 201, type: BrandEntity })
  async create(@Body() createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    return this.service.create(createBrandDto);
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, type: [BrandEntity] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async find(@Query('name') name?: string, @Query('active') active?: unknown): Promise<BrandEntity[]> {
    return this.service.find(name, active);
  }

  @Get(':id')
  @IsPublic()
  @ApiResponse({ status: 200, type: BrandEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<BrandEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: BrandEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto): Promise<BrandEntity> {
    return this.service.update(id, updateBrandDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
