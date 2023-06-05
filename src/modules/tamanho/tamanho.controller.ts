import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TamanhoService } from './tamanho.service';
import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { ApiComponent } from '../componente/decorator/componente.decorator';
import { TamanhoEntity } from './entities/tamanho.entity';

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
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'inativo', required: false, type: Boolean })
  async find(@Query('nome') nome?: string, @Query('inativo') inativo?: boolean | unknown): Promise<TamanhoEntity[]> {
    return this.service.find(nome, inativo);
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
