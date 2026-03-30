import { Pagination } from 'nestjs-typeorm-paginate';
import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

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

  @Get('codigo-barras/lista')
  @ApiPaginatedResponse(CodigoBarrasResumoDto)
  @ApiQuery({ name: 'tipo', required: false, enum: ['EAN13', 'RFID'] })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 0' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  @ApiQuery({ name: 'limite', required: false, description: 'Alias de limit' })
  async findCodigos(
    @Query('page', new DefaultValuePipe('0')) page: string,
    @Query('limit') limit?: string,
    @Query('limite') limite?: string,
    @Query('tipo') tipo?: 'EAN13' | 'RFID',
  ): Promise<Pagination<CodigoBarrasResumo>> {
    const pageValue = Number(page);
    const limitValue = Number(limit ?? limite ?? '100');

    if (!Number.isInteger(pageValue)) {
      throw new BadRequestException('O parâmetro "page" deve ser um número inteiro ');
    }

    if (!Number.isInteger(limitValue)) {
      throw new BadRequestException('O parâmetro "limit"/"limite" deve ser um número inteiro ');
    }

    const pageOneBased = pageValue === 0 ? 1 : pageValue;
    return this.service.findCodigos(pageOneBased, limitValue, tipo);
  }

  @Get('codigo-barras/:codigo')
  @ApiEmpresaAuth()
  async findProdutoByCodigo(@Param('codigo') codigo: string): Promise<EstoqueView> {
    return this.service.findProdutoByCodigo(codigo, this.contextService.empresaId());
  }
}
