import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TabelaDePrecoService } from './tabela-de-preco.service';
import { CreateTabelaDePrecoDto } from './dto/create-tabela-de-preco.dto';
import { UpdateTabelaDePrecoDto } from './dto/update-tabela-de-preco.dto';
import { TabelaDePrecoEntity } from './entities/tabela-de-preco.entity';
import { ApiComponent } from '../componente/decorator/componente.decorator';

@ApiBearerAuth()
@ApiTags('Tabelas de preços')
@Controller('tabelas-de-precos')
@ApiComponent('PRDFM010', 'Manutenção de tabela de preço')
export class TabelaDePrecoController {
  constructor(private readonly service: TabelaDePrecoService) {}

  @Post()
  @ApiResponse({ status: 201, type: TabelaDePrecoEntity })
  async create(@Body() createTabelaDePrecoDto: CreateTabelaDePrecoDto): Promise<TabelaDePrecoEntity> {
    return this.service.create(createTabelaDePrecoDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [TabelaDePrecoEntity] })
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'inativa', required: false, type: Boolean })
  async find(@Query('nome') nome?: string, @Query('inativa') inativa?: boolean | unknown): Promise<TabelaDePrecoEntity[]> {
    return this.service.find(nome, inativa);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: TabelaDePrecoEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<TabelaDePrecoEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: TabelaDePrecoEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateTabelaDePrecoDto): Promise<TabelaDePrecoEntity> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
