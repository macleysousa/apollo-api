import { Controller, DefaultValuePipe, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';
import { TipoDocumento } from './enum/tipo-documento.enum';
import { PessoaExtratoService } from './pessoa-extrato.service';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Pessoas - Extrato')
@Controller('pessoas/:pessoaId/extrato')
@ApiComponent('PESFL001', 'Consulta de extrato da pessoa')
export class PessoaExtratoController {
  constructor(private readonly service: PessoaExtratoService) {}

  @Get()
  @ApiResponse({ status: 200, type: [PessoaExtratoEntity] })
  @ApiQuery({ name: 'empresaIds', required: false, isArray: true })
  @ApiQuery({ name: 'pessoaId', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  async find(
    @Param('pessoaId') pessoaId: number,
    @Query('empresaIds', new DefaultValuePipe([])) empresaIds: number[],
    @Query('dataInicio', new DefaultValuePipe(Date)) dataInicio: Date,
    @Query('dataFim', new DefaultValuePipe(Date)) dataFim: Date
  ): Promise<PessoaExtratoEntity[]> {
    return this.service.find({ empresaIds, pessoaId, dataInicio, dataFim });
  }

  @Get('/adiantamentos')
  @ApiResponse({ status: 200, type: [PessoaExtratoEntity] })
  @ApiQuery({ name: 'empresaIds', required: false, isArray: true })
  @ApiQuery({ name: 'pessoaId', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  async findAdiantamentos(
    @Param('pessoaId') pessoaId: number,
    @Query('empresaIds', new DefaultValuePipe([])) empresaIds: number[],
    @Query('dataInicio', new DefaultValuePipe(Date)) dataInicio: Date,
    @Query('dataFim', new DefaultValuePipe(Date)) dataFim: Date
  ): Promise<PessoaExtratoEntity[]> {
    return this.service.find({ empresaIds, pessoaId, dataInicio, dataFim, tipoDocumento: [TipoDocumento.Adiantamento] });
  }

  @Get('/credito-de-devolucao')
  @ApiResponse({ status: 200, type: [PessoaExtratoEntity] })
  @ApiQuery({ name: 'empresaIds', required: false, isArray: true })
  @ApiQuery({ name: 'pessoaId', required: false })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  async findCreditoDeDevolucao(
    @Param('pessoaId') pessoaId: number,
    @Query('empresaIds', new DefaultValuePipe([])) empresaIds: number[],
    @Query('dataInicio', new DefaultValuePipe(Date)) dataInicio: Date,
    @Query('dataFim', new DefaultValuePipe(Date)) dataFim: Date
  ): Promise<PessoaExtratoEntity[]> {
    return this.service.find({ empresaIds, pessoaId, dataInicio, dataFim, tipoDocumento: [TipoDocumento.Credito_de_Devolucao] });
  }
}
