import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParsePessoaPipe } from 'src/commons/pipes/parsePessoa.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { CancelTransacaoPontoDto } from './dto/cancel-transacao-ponto.dto';
import { CreateTransacaoPontoDto } from './dto/create-transacao-ponto.dto';
import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoFilter } from './filters/transacao-ponto.filter';
import { TransacaoPontoService } from './transacao-ponto.service';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Pessoas - Transações de Pontos')
@Controller('pessoas/:pessoaId/transacoes-pontos')
@ApiComponent('PESFM003', 'Manutenção de Pontos (Pessoa)')
export class TransacaoPontoController {
  constructor(private readonly service: TransacaoPontoService) {}

  @Post()
  @ApiResponse({ status: 201, type: TransacaoPontoEntity })
  async create(
    @Param('pessoaId', ParsePessoaPipe) pessoaId: number,
    @Body() dto: CreateTransacaoPontoDto,
  ): Promise<TransacaoPontoEntity> {
    return this.service.create(pessoaId, dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: TransacaoPontoEntity, isArray: true })
  async find(
    @Param('pessoaId', ParsePessoaPipe) pessoaId: number,
    @Body() filter: TransacaoPontoFilter,
  ): Promise<TransacaoPontoEntity[]> {
    return this.service.find(pessoaId, filter);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: TransacaoPontoEntity })
  async findById(
    @Param('pessoaId', ParsePessoaPipe) pessoaId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransacaoPontoEntity> {
    return this.service.findById(pessoaId, id);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  async cancel(
    @Param('pessoaId', ParsePessoaPipe) pessoaId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelTransacaoPontoDto,
  ): Promise<void> {
    return this.service.cancel(pessoaId, id, dto);
  }
}
