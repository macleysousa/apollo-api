import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';

import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { ConsignacaoService } from './consignacao.service';
import { CancelConsinacaoDto } from './dto/cancelar-consignacao.dto';
import { OpenConsignacaoDto } from './dto/open-consignacao.dto';
import { UpdateConsignacaoDto } from './dto/update-consignacao.dto';
import { ConsignacaoEntity } from './entities/consignacao.entity';
import { ConsignacaoFilter } from './filters/consignacao-filter';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Consignações')
@Controller('consignacoes')
export class ConsignacaoController {
  constructor(private readonly service: ConsignacaoService) {}

  @Post()
  @ApiResponse({ status: 200, type: ConsignacaoEntity })
  @ApiOperation({ summary: 'CONFC001 - Consultar consignações' })
  @ApiComponent('CONFC001', 'Consultar consignações')
  async find(@Body() dto: ConsignacaoFilter): Promise<ConsignacaoEntity[]> {
    return this.service.find(dto);
  }

  @Post('/abrir')
  @ApiResponse({ status: 201, type: ConsignacaoEntity })
  @ApiOperation({ summary: 'CONFP001 - Abrir consignação' })
  @ApiComponent('CONFP001', 'Abrir consignação')
  async create(@Body() dto: OpenConsignacaoDto): Promise<ConsignacaoEntity> {
    return this.service.open(dto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ConsignacaoEntity })
  @ApiOperation({ summary: 'CONFC002 - Consultar consignação' })
  @ApiComponent('CONFC002', 'Consultar consignação')
  async findById(@CurrentBranch() empresa: EmpresaEntity, @Param('id') id: number): Promise<ConsignacaoEntity> {
    return this.service.findById(empresa.id, id);
  }

  @Put('/:id/atualizar')
  @ApiResponse({ status: 200, type: ConsignacaoEntity })
  @ApiOperation({ summary: 'CONFP002 - Atualizar consignação' })
  @ApiComponent('CONFP002', 'Atualizar consignação')
  async atualizar(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsignacaoDto
  ): Promise<ConsignacaoEntity> {
    return this.service.update(empresa.id, id, dto);
  }

  @Put('/:id/recalcular')
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'CONFP004 - Recalcular consignação' })
  @ApiComponent('CONFP004', 'Recalcular consignação')
  async recalculate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.calculate(id);
  }

  @Post('/:id/cancelar')
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'CONFP003 - Cancelar consignação' })
  @ApiComponent('CONFP003', 'Cancelar consignação')
  async cancel(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelConsinacaoDto
  ): Promise<void> {
    return this.service.cancel(empresa.id, id, dto);
  }
}
