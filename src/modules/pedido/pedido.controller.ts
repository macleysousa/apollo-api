import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { CancelPedidoDto } from './dto/cancel-pedido.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoEntity } from './entities/pedido.entity';
import { PedidoService } from './pedido.service';
import { PedidoFilter } from './filters/pedido.filters';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidoController {
  constructor(private readonly service: PedidoService) {}

  @Post()
  @ApiResponse({ status: 201, type: PedidoEntity })
  @ApiOperation({ summary: 'PEDFM001 - Manutenção de Pedidos' })
  @ApiComponent('PEDFM001', 'Manutenção de Pedidos')
  async create(@Body() createPedidoDto: CreatePedidoDto): Promise<PedidoEntity> {
    return this.service.create(createPedidoDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: PedidoEntity, isArray: true })
  @ApiOperation({ summary: 'PEDFC001 - Consulta de Pedidos' })
  @ApiComponent('PEDFC001', 'Consulta de Pedidos')
  async find(@Body() filter: PedidoFilter): Promise<PedidoEntity[]> {
    return this.service.find(filter);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: PedidoEntity })
  @ApiOperation({ summary: 'PEDFC002 - Consulta de Pedido' })
  @ApiComponent('PEDFC002', 'Consulta de Pedido')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<PedidoEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: PedidoEntity })
  @ApiOperation({ summary: 'PEDFM002 - Atualização de Pedido' })
  @ApiComponent('PEDFM002', 'Atualização de Pedido')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePedidoDto: UpdatePedidoDto): Promise<PedidoEntity> {
    return this.service.update(id, updatePedidoDto);
  }

  @Put(':id/cancelar')
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'PEDFM003 - Cancelamento de Pedido' })
  @ApiComponent('PEDFM003', 'Cancelamento de Pedido')
  async cancel(@Param('id', ParseIntPipe) id: number, @Body() cancelPedidoDto: CancelPedidoDto): Promise<void> {
    await this.service.cancel(id, cancelPedidoDto);
  }
}
