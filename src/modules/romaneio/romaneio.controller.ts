import { Pagination } from 'nestjs-typeorm-paginate';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseRomaneioEmAndamentoPipe } from 'src/commons/pipes/parseRomaneio.pipe';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ApiQueryEnum } from 'src/decorators/api-query-enum.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { EmpresaEntity } from '../empresa/entities/empresa.entity';

import { CreateRomaneioDto } from './dto/create-romaneio.dto';
import { OperacaoRomaneioDto } from './dto/observacao-romaneio.dto';
import { UpdateRomaneioDto } from './dto/update-romaneio.dto';
import { RomaneioFilter } from './filters/romaneio.filter';
import { RomaneioIncludeEnum } from './includes/romaneio.include';
import { RomaneioService } from './romaneio.service';
import { RomaneioView } from './views/romaneio.view';

@ApiTags('Romaneios')
@Controller('romaneios')
@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiComponent('ROMFP001', 'Lançamento de romaneios')
export class RomaneioController {
  constructor(private readonly service: RomaneioService) {}

  @Post()
  @ApiResponse({ status: 201, type: RomaneioView })
  async create(@Body() createRomaneioDto: CreateRomaneioDto): Promise<RomaneioView> {
    return this.service.create(createRomaneioDto);
  }

  @Get()
  @ApiPaginatedResponse(RomaneioView)
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Padrão: 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Padrão: 100' })
  async find(
    @Body() filter: RomaneioFilter,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ): Promise<Pagination<RomaneioView>> {
    return this.service.find(filter, page, limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: RomaneioView })
  @ApiQueryEnum({ name: 'incluir', required: false, enum: RomaneioIncludeEnum, isArray: true })
  async findOne(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Query('incluir', new DefaultValuePipe([])) relations: RomaneioIncludeEnum[],
  ): Promise<RomaneioView> {
    return this.service.findById(empresa.id, id, relations);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: RomaneioView })
  async update(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseRomaneioEmAndamentoPipe) id: number,
    @Body() updateRomaneioDto: UpdateRomaneioDto,
  ): Promise<RomaneioView> {
    return this.service.update(empresa.id, id, updateRomaneioDto);
  }

  @Put(':id/observacao')
  @ApiResponse({ status: 200, type: RomaneioView })
  async observacao(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() observacao: OperacaoRomaneioDto,
  ): Promise<RomaneioView> {
    return this.service.observacao(empresa.id, id, observacao);
  }
}
