import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseArrayPipe } from 'src/commons/pipes/parseArrayPipe.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiQueryEnum } from 'src/decorators/api-query-enum.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';

import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { ConsignacaoService } from './consignacao.service';
import { CancelConsinacaoDto } from './dto/cancelar-consignacao.dto';
import { OpenConsignacaoDto } from './dto/open-consignacao.dto';
import { UpdateConsignacaoDto } from './dto/update-consignacao.dto';
import { ConsignacaoFilter } from './filters/consignacao-filter';
import { ConsignacaoIncluir, ConsignacaoIncluirEnum } from './includes/consignacao.includ';
import { ConsignacaoView } from './views/consignacao.view';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Consignações')
@Controller('consignacoes')
export class ConsignacaoController {
  constructor(private readonly service: ConsignacaoService) {}

  @Post()
  @ApiResponse({ status: 200, type: [ConsignacaoView] })
  @ApiOperation({ summary: 'CONFC001 - Consultar consignações' })
  @ApiComponent('CONFC001', 'Consultar consignações')
  async find(@Body() dto: ConsignacaoFilter): Promise<ConsignacaoView[]> {
    return this.service.find(dto);
  }

  @Post('/abrir')
  @ApiResponse({ status: 201, type: ConsignacaoView })
  @ApiOperation({ summary: 'CONFP001 - Abrir consignação' })
  @ApiComponent('CONFP001', 'Abrir consignação')
  async create(@Body() dto: OpenConsignacaoDto): Promise<ConsignacaoView> {
    return this.service.open(dto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ConsignacaoView })
  @ApiOperation({ summary: 'CONFC002 - Consultar consignação' })
  @ApiComponent('CONFC002', 'Consultar consignação')
  @ApiQueryEnum({ name: 'incluir', required: false, enum: ConsignacaoIncluirEnum, isArray: true })
  async findById(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id') id: number,
    @Query('incluir', new ParseArrayPipe({ enum: ConsignacaoIncluirEnum })) includes: ConsignacaoIncluir[]
  ): Promise<ConsignacaoView> {
    return this.service.findById(empresa.id, id, includes);
  }

  @Put(':id/atualizar')
  @ApiResponse({ status: 200, type: ConsignacaoView })
  @ApiOperation({ summary: 'CONFP002 - Atualizar consignação' })
  @ApiComponent('CONFP002', 'Atualizar consignação')
  async atualizar(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsignacaoDto
  ): Promise<ConsignacaoView> {
    return this.service.update(empresa.id, id, dto);
  }

  @Put(':id/recalcular')
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'CONFP004 - Recalcular consignação' })
  @ApiComponent('CONFP004', 'Recalcular consignação')
  async recalculate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.calculate(id);
  }

  @Post(':id/fechar')
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'CONFP005 - Fechar consignação' })
  @ApiComponent('CONFP005', 'Fechar consignação')
  async close(@CurrentBranch() empresa: EmpresaEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.close(empresa.id, id);
  }

  @Post(':id/cancelar')
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
