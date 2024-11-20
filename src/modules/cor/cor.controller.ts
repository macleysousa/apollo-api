import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { CorService } from './cor.service';
import { CreateCorDto } from './dto/create-cor.dto';
import { UpdateCorDto } from './dto/update-cor.dto';
import { CorEntity } from './entities/cor.entity';
import { CorFilter } from './filters/cor.filter';

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
  async find(@Query() filter?: CorFilter): Promise<CorEntity[]> {
    return this.service.find(filter);
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
