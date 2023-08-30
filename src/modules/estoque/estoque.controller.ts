import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ParseBetweenPipe } from 'src/commons/pipes/parseBetween.pipe';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { EstoqueService } from './estoque.service';
import { EstoqueView } from './views/estoque.view';

@ApiTags('Estoque')
@Controller('estoque')
@ApiBearerAuth()
@ApiComponent('PRDFL001', 'Consultar estoque do produto')
export class EstoqueController {
  constructor(private readonly service: EstoqueService) {}

  @Get('/saldo')
  @ApiPaginatedResponse(EstoqueView)
  @ApiQuery({ name: 'empresaIds', required: false, isArray: true })
  @ApiQuery({ name: 'referenciaIds', required: false, isArray: true })
  @ApiQuery({ name: 'referenciaIdExternos', required: false, isArray: true })
  @ApiQuery({ name: 'produtoIds', required: false, isArray: true })
  @ApiQuery({ name: 'produtoIdExternos', required: false, isArray: true })
  @ApiQuery({ name: 'corIds', required: false, isArray: true })
  @ApiQuery({ name: 'tamanhoIds', required: false, isArray: true })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async find(
    @Query('empresaIds', new DefaultValuePipe([])) empresaIds: number[],
    @Query('referenciaIds', new DefaultValuePipe([])) referenciaIds: number[],
    @Query('referenciaIdExternos', new DefaultValuePipe([])) referenciaIdExternos: string[],
    @Query('produtoIds', new DefaultValuePipe([])) produtoIds: number[],
    @Query('produtoIdExternos', new DefaultValuePipe([])) produtoIdExternos: string[],
    @Query('corIds', new DefaultValuePipe([])) corIds: number[],
    @Query('tamanhoIds', new DefaultValuePipe([])) tamanhoIds: number[],
    @Query('page', new DefaultValuePipe(1), new ParseBetweenPipe(1, 1000)) page: number,
    @Query('limit', new DefaultValuePipe(100), new ParseBetweenPipe(1, 1000)) limit: number
  ): Promise<Pagination<EstoqueView>> {
    return this.service.find(
      {
        empresaIds,
        referenciaIds,
        referenciaIdExternos,
        produtoIds,
        produtoIdExternos,
        corIds,
        tamanhoIds,
      },
      page,
      limit
    );
  }
}
