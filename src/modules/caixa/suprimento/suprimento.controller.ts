import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseCaixaAbertoPipe } from 'src/commons/pipes/parseCaixa.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { CancelarSuprimentoDto } from './dto/cancelar-suprimento.dto';
import { CreateSuprimentoDto } from './dto/create-suprimento.dto';
import { CaixaSuprimentoEntity } from './entities/suprimento.entity';
import { CaixaSuprimentoService } from './suprimento.service';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Caixas - Suprimento')
@Controller('caixas/:caixaId/suprimento')
@ApiComponent('FCXFM003', 'Suprimento de caixa')
export class CaixaSuprimentoController {
  constructor(private readonly service: CaixaSuprimentoService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Suprimento registrado e lançado no extrato', type: CaixaSuprimentoEntity })
  async create(@Param('caixaId', ParseCaixaAbertoPipe) caixaId: number, @Body() dto: CreateSuprimentoDto) {
    return this.service.create(caixaId, dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de suprimentos do caixa', type: [CaixaSuprimentoEntity] })
  async find(@Param('caixaId', ParseIntPipe) caixaId: number) {
    return this.service.find(caixaId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Detalhes do suprimento', type: CaixaSuprimentoEntity })
  async findById(@Param('caixaId', ParseIntPipe) caixaId: number, @Param('id', ParseIntPipe) id: number) {
    return this.service.findById(caixaId, id);
  }

  @Put(':id/cancelar')
  @ApiComponent('FCXFP005', 'Cancelar suprimento')
  @ApiResponse({ status: 200, description: 'Suprimento cancelado com sucesso' })
  async cancelar(
    @Param('caixaId', ParseCaixaAbertoPipe) caixaId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelarSuprimentoDto,
  ): Promise<void> {
    await this.service.cancel(caixaId, id, dto.motivo);
  }
}
