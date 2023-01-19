import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiComponent } from 'src/modules/component/component.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { SubCategoryService } from './sub.service';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubCategoryEntity } from './entities/sub.entity';

@ApiTags('Categories')
@Controller('categories/:id/sub')
@ApiBearerAuth()
@ApiComponent('PRDFM005', 'Manutenção da sub-categoria do produto')
export class SubCategoryController {
  constructor(private readonly subService: SubCategoryService) {}

  @Post()
  @ApiResponse({ status: 201, type: SubCategoryEntity })
  async create(@Param('id', ParseIntPipe) id: number, @Body() createSubDto: CreateSubDto): Promise<SubCategoryEntity> {
    return this.subService.create(id, createSubDto);
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, type: [SubCategoryEntity] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async find(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name?: string,
    @Query('active') active?: unknown
  ): Promise<SubCategoryEntity[]> {
    return this.subService.find(id, name, active);
  }

  @Get(':subId')
  @IsPublic()
  @ApiResponse({ status: 200, type: SubCategoryEntity })
  async findById(@Param('id', ParseIntPipe) id: number, @Param('subId', ParseIntPipe) subId: number): Promise<SubCategoryEntity> {
    return this.subService.findById(id, subId);
  }

  @Put(':subId')
  @ApiResponse({ status: 200, type: SubCategoryEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Param('subId', ParseIntPipe) subId: number,
    @Body() updateSubDto: UpdateSubDto
  ): Promise<SubCategoryEntity> {
    return this.subService.update(id, subId, updateSubDto);
  }

  @Delete(':subId')
  async remove(@Param('id', ParseIntPipe) id: number, @Param('subId', ParseIntPipe) subId: number): Promise<void> {
    return this.subService.remove(id, subId);
  }
}
