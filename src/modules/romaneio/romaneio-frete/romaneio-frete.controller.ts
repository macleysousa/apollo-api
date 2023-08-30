import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseRomaneioEmAndamentoPipe } from 'src/commons/pipes/parseRomaneio.pipe';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

import { CreateRomaneioFreteDto } from './dto/create-romaneio-frete.dto';
import { RomaneioFreteEntity } from './entities/romaneio-frete.entity';
import { RomaneioFreteService } from './romaneio-frete.service';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Romaneios Frete')
@Controller('romaneios/:romaneioId/frete')
@ApiComponent('ROMFP003', 'Lançamento de romaneios - frete')
export class RomaneioFreteController {
  constructor(private readonly service: RomaneioFreteService) {}

  @Post()
  @ApiResponse({ status: 201, type: RomaneioFreteEntity })
  create(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('romaneioId', ParseRomaneioEmAndamentoPipe) romaneioId: number,
    @Body() createRomaneioFreteDto: CreateRomaneioFreteDto
  ): Promise<RomaneioFreteEntity> {
    return this.service.upsert(empresa.id, romaneioId, createRomaneioFreteDto);
  }

  @Get()
  async findByRomaneioId(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('romaneioId', ParseRomaneioEmAndamentoPipe) romaneioId: number
  ): Promise<RomaneioFreteEntity> {
    return this.service.findByRomaneioId(empresa.id, romaneioId);
  }

  @Delete()
  async delete(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('romaneioId', ParseRomaneioEmAndamentoPipe) romaneioId: number
  ): Promise<void> {
    return this.service.delete(empresa.id, romaneioId);
  }
}
