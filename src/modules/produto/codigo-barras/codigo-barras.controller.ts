import { Pagination } from 'nestjs-typeorm-paginate';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ParseBetweenPipe } from 'src/commons/pipes/parseBetween.pipe';
import { ContextService } from 'src/context/context.service';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { EstoqueView } from 'src/modules/estoque/views/estoque.view';

import { CodigoBarrasResumo, CodigoBarrasService } from './codigo-barras.service';
import { CodigoBarrasResumoDto } from './dto/codigo-barras-resumo.dto';
import { CreateCodigoBarrasDto } from './dto/create-codigo-barras.dto';

@ApiTags('Produtos')
@Controller('produtos')
@ApiBearerAuth()
@ApiComponent('PRDFM009', 'Manutenção de codigo de barras')
export class CodigoBarrasController {
  constructor(
    private readonly service: CodigoBarrasService,
    private readonly contextService: ContextService,
  ) {}

  @Post(':id/codigo-barras')
  async create(@Param('id', ParseIntPipe) id: number, @Body() createDto: CreateCodigoBarrasDto): Promise<void> {
    await this.service.create(id, createDto);
  }

  @Delete(':id/codigo-barras/:barcode')
  async remove(@Param('id', ParseIntPipe) id: number, @Param('barcode') barcode: string): Promise<void> {
    await this.service.remove(id, barcode);
  }

  @Get('codigo-barras')
  @ApiPaginatedResponse(CodigoBarrasResumoDto)
  @ApiQuery({ name: 'tipo', required: false, enum: ['EAN13', 'RFID'] })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async findCodigos(
    @Query('page', new DefaultValuePipe(1), new ParseBetweenPipe(1, 1000)) page: number,
    @Query('limit', new DefaultValuePipe(100), new ParseBetweenPipe(1, 1000)) limit: number,
    @Query('tipo') tipo?: 'EAN13' | 'RFID',
  ): Promise<Pagination<CodigoBarrasResumo>> {
    return this.service.findCodigos(page, limit, tipo);
  }

  @Get('codigo-barras/:codigo/produto')
  @ApiEmpresaAuth()
  async findProdutoByCodigo(@Param('codigo') codigo: string): Promise<EstoqueView> {
    return this.service.findProdutoByCodigo(codigo, this.contextService.empresaId());
  }
}
