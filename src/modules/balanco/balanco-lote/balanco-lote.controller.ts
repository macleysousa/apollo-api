import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { BalancoLoteService } from './balanco-lote.service';
import { CancelarBalancoLoteDto } from './dto/cancelar-balanco-lote.dto';
import { CreateBalancoLoteDto } from './dto/create-balanco-lote.dto';
import { UpdateBalancoLoteDto } from './dto/update-balanco-lote.dto';
import { BalancoLoteEntity } from './entities/balanco-lote.entity';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Balanços Lotes')
@Controller('balancos/:balancoId/lotes')
@ApiComponent('BALFP003', 'Lançamento de balanços - lotes')
export class BalancoLoteController {
  constructor(private readonly service: BalancoLoteService) {}

  @Post()
  @ApiResponse({ status: 201, type: BalancoLoteEntity })
  async create(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Body() createDto: CreateBalancoLoteDto,
  ): Promise<BalancoLoteEntity> {
    return this.service.create(balancoId, createDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [BalancoLoteEntity] })
  async find(@Param('balancoId', ParseIntPipe) balancoId: number): Promise<BalancoLoteEntity[]> {
    return this.service.findByBalancoId(balancoId);
  }

  @Put(':loteId')
  @ApiResponse({ status: 200, type: BalancoLoteEntity })
  async update(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Param('loteId', ParseIntPipe) loteId: number,
    @Body() updateDto: UpdateBalancoLoteDto,
  ): Promise<BalancoLoteEntity> {
    return this.service.update(balancoId, loteId, updateDto);
  }

  @Put(':loteId/cancelar')
  @ApiResponse({ status: 200, type: BalancoLoteEntity })
  async cancelar(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Param('loteId', ParseIntPipe) loteId: number,
    @Body() dto: CancelarBalancoLoteDto,
  ): Promise<BalancoLoteEntity> {
    return this.service.cancelar(balancoId, loteId, dto);
  }
}
