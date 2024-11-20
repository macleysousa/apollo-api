import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { ReferenciaEntity } from './entities/referencia.entity';
import { ReferenciaService } from './referencia.service';

@ApiTags('Referências')
@Controller('referencias')
@ApiBearerAuth()
@ApiComponent('PRDFM003', 'Manutenção de referência')
export class ReferenciaController {
  constructor(private readonly referenceService: ReferenciaService) {}

  @Post()
  @ApiResponse({ type: ReferenciaEntity, status: 201 })
  async create(@Body() createReferenceDto: CreateReferenciaDto): Promise<ReferenciaEntity> {
    return this.referenceService.create(createReferenceDto);
  }

  @Get()
  @ApiResponse({ type: [ReferenciaEntity], status: 200 })
  @ApiQuery({ name: 'nome', required: false })
  @ApiQuery({ name: 'idExterno', required: false })
  async find(@Query('nome') nome?: string, @Query('idExterno') idExterno?: string): Promise<ReferenciaEntity[]> {
    return this.referenceService.find(nome, idExterno);
  }

  @Get(':id')
  @ApiResponse({ type: ReferenciaEntity, status: 200 })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ReferenciaEntity> {
    return this.referenceService.findById(id);
  }

  @Put(':id')
  @ApiResponse({ type: ReferenciaEntity, status: 200 })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReferenceDto: UpdateReferenciaDto,
  ): Promise<ReferenciaEntity> {
    return this.referenceService.update(id, updateReferenceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.referenceService.remove(id);
  }
}
