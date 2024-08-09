import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { TamanhoEntity } from './entities/tamanho.entity';
import { TamanhoFilter } from './filters/tamanho.filter';
import { TamanhoService } from './tamanho.service';

@ApiTags('Tamanhos')
@Controller('tamanhos')
@ApiBearerAuth()
@ApiComponent('PRDFM002', 'Manutenção de tamanho de produto')
export class TamanhoController {
  constructor(private readonly service: TamanhoService) {}

  @Post()
  @ApiResponse({ status: 201, type: TamanhoEntity })
  async create(@Body() createDto: CreateTamanhoDto): Promise<TamanhoEntity> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [TamanhoEntity] })
  async find(@Query() filter: TamanhoFilter): Promise<TamanhoEntity[]> {
    return this.service.find(filter);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: TamanhoEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<TamanhoEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: TamanhoEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateTamanhoDto): Promise<TamanhoEntity> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
