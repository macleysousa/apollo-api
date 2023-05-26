import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { TamanhoService } from './tamanho.service';
import { CreateTamanhoDto } from './dto/create-tamanho.dto';
import { UpdateTamanhoDto } from './dto/update-tamanho.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async create(@Body() createSizeDto: CreateTamanhoDto): Promise<TamanhoEntity> {
    return this.service.create(createSizeDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [TamanhoEntity] })
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'inativa', required: false, type: Boolean })
  async find(@Query('nome') nome?: string, @Query('inativa') inativa?: boolean | unknown): Promise<TamanhoEntity[]> {
    return this.service.find(nome, inativa);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: TamanhoEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<TamanhoEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: TamanhoEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSizeDto: UpdateTamanhoDto): Promise<TamanhoEntity> {
    return this.service.update(id, updateSizeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
