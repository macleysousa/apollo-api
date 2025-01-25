import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { ReferenciaEntity } from './entities/referencia.entity';
import { ReferenciaFilter } from './filters/referencia.filter';
import { ReferenciaBaseFilter } from './filters/referencia-base.filter';
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
  async find(@Query() filter?: ReferenciaFilter): Promise<ReferenciaEntity[]> {
    return this.referenceService.find(filter);
  }

  @Get(':id')
  @ApiResponse({ type: ReferenciaEntity, status: 200 })
  async findById(@Param('id', ParseIntPipe) id: number, @Query() filter?: ReferenciaBaseFilter): Promise<ReferenciaEntity> {
    return this.referenceService.findById(id, filter?.incluir);
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
