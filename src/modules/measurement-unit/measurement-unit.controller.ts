import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { MeasurementUnitService } from './measurement-unit.service';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMeasurementUnitDto } from './dto/update-measurement-unit.dto';
import { MeasurementUnitEntity } from './entities/measurement-unit.entity';
import { ApiComponent } from '../component/component.decorator';

@ApiTags('Measurement Units')
@Controller('measurement-units')
@ApiComponent('PRDFM007', 'Manutenção de unidade de medida')
export class MeasurementUnitController {
  constructor(private readonly service: MeasurementUnitService) {}

  @Post()
  @ApiResponse({ status: 201, type: MeasurementUnitEntity })
  async create(@Body() createDto: CreateMeasurementUnitDto): Promise<MeasurementUnitEntity> {
    return this.service.create(createDto);
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, type: [MeasurementUnitEntity] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  async find(@Query('name') name?: string, @Query('active') active?: unknown): Promise<MeasurementUnitEntity[]> {
    return this.service.find(name, active);
  }

  @Get(':id')
  @IsPublic()
  @ApiResponse({ status: 200, type: MeasurementUnitEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<MeasurementUnitEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: MeasurementUnitEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateMeasurementUnitDto): Promise<MeasurementUnitEntity> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
