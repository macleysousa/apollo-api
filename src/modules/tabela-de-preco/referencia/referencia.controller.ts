import { Pagination } from 'nestjs-typeorm-paginate';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseBetweenPipe } from 'src/commons/pipes/parseBetween.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ReferenciaEntity } from 'src/modules/referencia/entities/referencia.entity';

import { AddPrecoReferenciaDto } from './dto/add-referencia.dto';
import { UpdatePrecoReferenciaDto } from './dto/update-referencia.dto';
import { PrecoReferenciaService } from './referencia.service';
import { PrecoReferenciaView } from './views/referencia.view';

@ApiBearerAuth()
@ApiTags('Tabelas de preços - Referências')
@Controller('tabelas-de-precos/:tabelaDePrecoId/referencias')
@ApiComponent('PRDFM011', 'Manutenção de tabela de preço - Referências')
export class PrecoReferenciaController {
  constructor(private readonly service: PrecoReferenciaService) {}

  @Post()
  @ApiResponse({ status: 201, type: PrecoReferenciaView })
  async add(
    @Param('tabelaDePrecoId', ParseIntPipe) tabelaDePrecoId: number,
    @Body() upSertPrecoReferenciaDto: AddPrecoReferenciaDto,
  ): Promise<PrecoReferenciaView> {
    return this.service.add(tabelaDePrecoId, upSertPrecoReferenciaDto);
  }

  @Get()
  @ApiPaginatedResponse(PrecoReferenciaView)
  @ApiQuery({ name: 'referenciaIds', required: false, type: 'number', isArray: true })
  @ApiQuery({ name: 'referenciaIdExternos', required: false, type: 'string', isArray: true })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async find(
    @Param('tabelaDePrecoId', ParseIntPipe) tabelaDePrecoId: number,
    @Query('referenciaIds', new DefaultValuePipe([])) referenciaIds: number[],
    @Query('referenciaIdExternos', new DefaultValuePipe([])) referenciaIdExternos: string[],
    @Query('page', new DefaultValuePipe(1), new ParseBetweenPipe(1, 1000)) page: number,
    @Query('limit', new DefaultValuePipe(100), new ParseBetweenPipe(1, 1000)) limit: number,
  ): Promise<Pagination<PrecoReferenciaView>> {
    return this.service.find(tabelaDePrecoId, { referenciaIds, referenciaIdExternos, page, limit });
  }

  @Get('nao-associadas/lista')
  @ApiPaginatedResponse(ReferenciaEntity)
  @ApiQuery({ name: 'nome', required: false, type: 'string' })
  @ApiQuery({ name: 'idExterno', required: false, type: 'string' })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async findNaoAssociadas(
    @Param('tabelaDePrecoId', ParseIntPipe) tabelaDePrecoId: number,
    @Query('nome') nome?: string,
    @Query('idExterno') idExterno?: string,
    @Query('page', new DefaultValuePipe(1), new ParseBetweenPipe(1, 1000)) page?: number,
    @Query('limit', new DefaultValuePipe(100), new ParseBetweenPipe(1, 1000)) limit?: number,
  ): Promise<Pagination<ReferenciaEntity>> {
    return this.service.findNaoAssociadas(tabelaDePrecoId, { nome, idExterno, page, limit });
  }

  @Get(':referenciaId')
  @ApiResponse({ status: 200, type: PrecoReferenciaView })
  async findByReferenciaId(
    @Param('tabelaDePrecoId', ParseIntPipe) tabelaDePrecoId: number,
    @Param('referenciaId', ParseIntPipe) referenciaId: number,
  ): Promise<PrecoReferenciaView> {
    return this.service.findByReferenciaId(tabelaDePrecoId, referenciaId);
  }

  @Put(':referenciaId')
  @ApiResponse({ status: 200, type: PrecoReferenciaView })
  async update(
    @Param('tabelaDePrecoId', ParseIntPipe) tabelaDePrecoId: number,
    @Param('referenciaId', ParseIntPipe) referenciaId: number,
    @Body() dto: UpdatePrecoReferenciaDto,
  ): Promise<PrecoReferenciaView> {
    return this.service.update(tabelaDePrecoId, referenciaId, dto);
  }

  @Delete(':referenciaId')
  @ApiResponse({ status: 204 })
  async remove(
    @Param('tabelaDePrecoId', ParseIntPipe) tabelaDePrecoId: number,
    @Param('referenciaId', ParseIntPipe) referenciaId: number,
  ): Promise<void> {
    await this.service.remove(tabelaDePrecoId, referenciaId);
  }
}
