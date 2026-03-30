import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ContextService } from 'src/context/context.service';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { EstoqueView } from 'src/modules/estoque/views/estoque.view';

import { CodigoBarrasResumo, CodigoBarrasService } from './codigo-barras.service';
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
  @ApiQuery({ name: 'tipo', required: false, enum: ['EAN13', 'RFID'] })
  async findCodigos(@Query('tipo') tipo?: 'EAN13' | 'RFID'): Promise<CodigoBarrasResumo[]> {
    return this.service.findCodigos(tipo);
  }

  @Get('codigo-barras/:codigo/produto')
  @ApiEmpresaAuth()
  async findProdutoByCodigo(@Param('codigo') codigo: string): Promise<EstoqueView> {
    return this.service.findProdutoByCodigo(codigo, this.contextService.empresaId());
  }
}
