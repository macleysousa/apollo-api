import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ParseBetweenPipe } from 'src/commons/pipes/parseBetween.pipe';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { AddPrecoReferenciaDto } from './dto/add-referencia.dto';
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
    @Body() upSertPrecoReferenciaDto: AddPrecoReferenciaDto
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
    @Query('limit', new DefaultValuePipe(100), new ParseBetweenPipe(1, 1000)) limit: number
  ): Promise<Pagination<PrecoReferenciaView>> {
    return this.service.find(tabelaDePrecoId, { referenciaIds, referenciaIdExternos, page, limit });
  }

  @Get(':referenciaId')
  @ApiResponse({ status: 200, type: PrecoReferenciaView })
  async findByReferenciaId(
    @Param('tabelaDePrecoId', ParseIntPipe) tabelaDePrecoId: number,
    @Param('referenciaId', ParseIntPipe) referenciaId: number
  ): Promise<PrecoReferenciaView> {
    return this.service.findByReferenciaId(tabelaDePrecoId, referenciaId);
  }
}
