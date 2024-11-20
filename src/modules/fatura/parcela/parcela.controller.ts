import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

import { UpsertParcelaDto } from './dto/upsert-parcela.dto';
import { FaturaParcelaEntity } from './entities/parcela.entity';
import { FaturaParcelaService } from './parcela.service';

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
    @Param('faturaId', ParseIntPipe) faturaId: number,
  ): Promise<FaturaParcelaEntity[]> {
    return this.service.findByFaturaId(empresa.id, faturaId);
  }

  @Get(':parcela')
  @ApiResponse({ status: 200, type: FaturaParcelaEntity })
  findByParcela(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('faturaId', ParseIntPipe) faturaId: number,
    @Param('parcela', ParseIntPipe) id: number,
  ): Promise<FaturaParcelaEntity> {
    return this.service.findByParcela(empresa.id, faturaId, id);
  }

  @Delete(':parcela')
  @ApiResponse({ status: 200 })
  remove(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('faturaId', ParseIntPipe) faturaId: number,
    @Param('parcela', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.service.remove(empresa.id, faturaId, id);
  }
}
