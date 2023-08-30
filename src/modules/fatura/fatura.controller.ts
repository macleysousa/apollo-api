import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ParseBetweenPipe } from 'src/commons/pipes/parseBetween.pipe';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { CreateFaturaManualDto } from './dto/create-fatura-manual.dto';
import { UpdateFaturaManualDto } from './dto/update-fatura-manual.dto';
import { FaturaEntity } from './entities/fatura.entity';
import { FaturaService } from './fatura.service';
import { Relations } from './relations/relations.type';

@ApiTags('Faturas')
@Controller('faturas')
@ApiBearerAuth()
@ApiComponent('FCRFM001', 'Manutenção de faturas')
export class FaturaController {
  constructor(private readonly service: FaturaService) {}

  @Post()
  @ApiResponse({ status: 201, type: FaturaEntity })
  async create(@Body() createFaturaDto: CreateFaturaManualDto): Promise<FaturaEntity> {
    return this.service.createManual(createFaturaDto);
  }

  @Get()
  @ApiPaginatedResponse(FaturaEntity)
  @ApiQuery({ name: 'empresaIds', required: false, isArray: true })
  @ApiQuery({ name: 'faturaIds', required: false, isArray: true })
  @ApiQuery({ name: 'pessoaIds', required: false, isArray: true })
  @ApiQuery({ name: 'dataInicio', required: false })
  @ApiQuery({ name: 'dataFim', required: false })
  @ApiQuery({ name: 'incluir', required: false, description: 'Opçoes: itens', isArray: true })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async find(
    @Query('empresaIds', new DefaultValuePipe([])) empresaIds: number[],
    @Query('faturaIds', new DefaultValuePipe([])) faturaIds: number[],
    @Query('pessoaIds', new DefaultValuePipe([])) pessoaIds: number[],
    @Query('dataInicio', new DefaultValuePipe(Date)) dataInicio: Date,
    @Query('dataFim', new DefaultValuePipe(Date)) dataFim: Date,
    @Query('incluir', new DefaultValuePipe([])) relations: Relations[],
    @Query('page', new DefaultValuePipe(1), new ParseBetweenPipe(1, 1000)) page: number,
    @Query('limit', new DefaultValuePipe(100), new ParseBetweenPipe(1, 1000)) limit: number
  ): Promise<Pagination<FaturaEntity>> {
    return this.service.find({ empresaIds, faturaIds, pessoaIds, dataInicio, dataFim }, page, limit, relations);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: FaturaEntity })
  @ApiQuery({ name: 'incluir', required: false, description: 'Opçoes: itens', isArray: true })
  async findById(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Query('incluir', new DefaultValuePipe([])) relations: Relations[]
  ): Promise<FaturaEntity> {
    return this.service.findById(empresa.id, id, relations);
  }

  @Put(':id')
  async update(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaturaDto: UpdateFaturaManualDto
  ) {
    return this.service.update(empresa.id, id, updateFaturaDto);
  }

  @Delete(':id')
  async cancelar(@CurrentBranch() empresa: EmpresaEntity, @Param('id', ParseIntPipe) id: number) {
    return this.service.cancelar(empresa.id, id);
  }
}
