import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentBranch } from 'src/decorators/current-auth.decorator';
import { ApiComponent } from 'src/modules/componente/decorator/componente.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

import { UpsertParcelaDto } from './dto/upsert-parcela.dto';
import { FaturaParcelaEntity } from './entities/parcela.entity';
import { FaturaParcelaService } from './parcela.service';
import { ReceberParcelaDto } from './dto/receber-parcela.dto';
import { CancelarParcelaDto } from './dto/cancelar-parcela.dto';

@ApiTags('Faturas - Parcelas')
@Controller('faturas/:faturaId/parcelas')
@ApiBearerAuth()
@ApiComponent('FCRFM002', 'Manutenção de faturas - Parcelas')
export class FaturaParcelaController {
  constructor(private readonly service: FaturaParcelaService) {}

  @Post()
  @ApiResponse({ status: 201, type: FaturaParcelaEntity })
  async add(@Param('faturaId', ParseIntPipe) faturaId: number, @Body() dto: UpsertParcelaDto): Promise<FaturaParcelaEntity> {
    return this.service.add(faturaId, dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [FaturaParcelaEntity] })
  async findByFaturaId(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('faturaId', ParseIntPipe) faturaId: number
  ): Promise<FaturaParcelaEntity[]> {
    return this.service.findByFaturaId(empresa.id, faturaId);
  }

  @Get(':parcela')
  @ApiResponse({ status: 200, type: FaturaParcelaEntity })
  findByParcela(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('faturaId', ParseIntPipe) faturaId: number,
    @Param('parcela', ParseIntPipe) id: number
  ): Promise<FaturaParcelaEntity> {
    return this.service.findByParcela(empresa.id, faturaId, id);
  }

  @Delete(':parcela')
  @ApiResponse({ status: 200 })
  remove(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('faturaId', ParseIntPipe) faturaId: number,
    @Param('parcela', ParseIntPipe) id: number
  ): Promise<void> {
    return this.service.remove(empresa.id, faturaId, id);
  }

  @Post(':parcela/receber')
  @ApiResponse({ status: 200 })
  async receber(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('faturaId', ParseIntPipe) faturaId: number,
    @Body() dto: ReceberParcelaDto
  ): Promise<void> {
    return this.service.receber(empresa.id, faturaId, dto);
  }

  @Post(':parcela/cancelar')
  @ApiResponse({ status: 200 })
  async cancelar(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('faturaId', ParseIntPipe) faturaId: number,
    @Body() dto: CancelarParcelaDto
  ): Promise<void> {
    return this.service.cancelar(empresa.id, faturaId, dto);
  }
}
