import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { CaixaService } from './caixa.service';
import { CreateCaixaDto } from './dto/create-caixa.dto';
import { CaixaEntity } from './entities/caixa.entity';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Caixas')
@Controller('caixas')
@ApiComponent('FCXFM001', 'Manutenção de caixa')
export class CaixaController {
  constructor(private readonly service: CaixaService) {}

  @Get('/aberto')
  @ApiComponent('FCXFP006', 'Consulta de Caixa Aberto')
  @ApiQuery({ name: 'empresaId', type: Number, required: true })
  @ApiQuery({ name: 'terminalId', type: Number, required: true })
  @ApiResponse({ status: 200, type: CaixaEntity })
  async findOpen(
    @Query('empresaId', ParseIntPipe) empresaId: number,
    @Query('terminalId', ParseIntPipe) terminalId: number,
  ): Promise<CaixaEntity> {
    return this.service.findOpen(empresaId, terminalId);
  }

  @Post('/abrir')
  @ApiComponent('FCXFP001', 'Abertura de Caixa')
  @ApiResponse({ status: 201, type: CaixaEntity })
  async open(@Body() createCaixaDto: CreateCaixaDto): Promise<CaixaEntity> {
    return this.service.open(createCaixaDto);
  }
}
