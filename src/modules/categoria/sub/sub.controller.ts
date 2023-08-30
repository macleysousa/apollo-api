import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { SubCategoriaService } from './sub.service';
import { CreateSubCategoriaDto } from './dto/create-sub.dto';
import { UpdateSubCategoriaDto } from './dto/update-sub.dto';
import { SubCategoriaEntity } from './entities/sub.entity';

@ApiTags('Categorias')
@Controller('categorias/:id/sub')
@ApiBearerAuth()
@ApiComponent('PRDFM005', 'Manutenção da sub-categoria do produto')
export class SubCategoriaController {
  constructor(private readonly subService: SubCategoriaService) {}

  @Post()
  @ApiResponse({ status: 201, type: SubCategoriaEntity })
  async create(@Param('id', ParseIntPipe) id: number, @Body() createSubDto: CreateSubCategoriaDto): Promise<SubCategoriaEntity> {
    return this.subService.create(id, createSubDto);
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, type: [SubCategoriaEntity] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async find(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name?: string,
    @Query('active') active?: unknown
  ): Promise<SubCategoriaEntity[]> {
    return this.subService.find(id, name, active);
  }

  @Get(':subId')
  @IsPublic()
  @ApiResponse({ status: 200, type: SubCategoriaEntity })
  async findById(@Param('id', ParseIntPipe) id: number, @Param('subId', ParseIntPipe) subId: number): Promise<SubCategoriaEntity> {
    return this.subService.findById(id, subId);
  }

  @Put(':subId')
  @ApiResponse({ status: 200, type: SubCategoriaEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Param('subId', ParseIntPipe) subId: number,
    @Body() updateSubDto: UpdateSubCategoriaDto
  ): Promise<SubCategoriaEntity> {
    return this.subService.update(id, subId, updateSubDto);
  }

  @Delete(':subId')
  async remove(@Param('id', ParseIntPipe) id: number, @Param('subId', ParseIntPipe) subId: number): Promise<void> {
    return this.subService.remove(id, subId);
  }
}
