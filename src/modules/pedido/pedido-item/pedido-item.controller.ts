import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { AddPedidoItemDto } from './dto/add-pedido-item.dto';
import { RemovePedidoItemDto } from './dto/remove-pedido-item.dto';
import { PedidoItemEntity } from './entities/pedido-item.entity';
import { PedidoItemService } from './pedido-item.service';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Pedidos - Itens')
@Controller('pedidos-itens')
export class PedidoItemController {
  constructor(private readonly service: PedidoItemService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: PedidoItemEntity, isArray: true })
  @ApiOperation({ summary: 'PEDFC003 - Consulta de Itens do Pedido' })
  @ApiComponent('PEDFC003', 'Consulta de Itens do Pedido')
  async findByPedidoId(@Param('id', ParseIntPipe) id: number): Promise<PedidoItemEntity[]> {
    return this.service.findByPedidoId(id);
  }

  @Post(':id/adicionar')
  @ApiResponse({ status: 201, type: PedidoItemEntity })
  @ApiOperation({ summary: 'PEDFM004 - Manutenção de Itens do Pedidos' })
  @ApiComponent('PEDFM004', 'Manutenção de Itens do Pedidos')
  async add(@Param('id', ParseIntPipe) id: number, @Body() addPedidoItemDto: AddPedidoItemDto): Promise<PedidoItemEntity> {
    return this.service.add(id, addPedidoItemDto);
  }

  @Put(':id/remover')
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'PEDFM005 - Remover de Item do Pedido' })
  @ApiComponent('PEDFM005', 'Remover de Item do Pedido')
  async remove(@Param('id', ParseIntPipe) id: number, @Body() removePedidoItemDto: RemovePedidoItemDto): Promise<void> {
    return this.service.remove(id, removePedidoItemDto);
  }
}
