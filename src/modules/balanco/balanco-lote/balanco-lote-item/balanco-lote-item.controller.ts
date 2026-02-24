import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { BalancoLoteItemService } from './balanco-lote-item.service';
import { AddRemoveBalancoLoteItemDto } from './dto/add-remove-balanco-lote-item.dto';
import { BalancoLoteItemEntity } from './entities/balanco-lote-item.entity';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Balanços Lotes Itens')
@Controller('balancos/:balancoId/lotes/:loteId/itens')
@ApiComponent('BALFP004', 'Lançamento de balanços - lotes itens')
export class BalancoLoteItemController {
  constructor(private readonly service: BalancoLoteItemService) {}

  @Post()
  @ApiResponse({ status: 201 })
  async add(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Param('loteId', ParseIntPipe) loteId: number,
    @Body() dto: AddRemoveBalancoLoteItemDto,
  ): Promise<void> {
    return this.service.add(balancoId, loteId, dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [BalancoLoteItemEntity] })
  async find(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Param('loteId', ParseIntPipe) loteId: number,
  ): Promise<BalancoLoteItemEntity[]> {
    return this.service.findByLoteId(balancoId, loteId);
  }

  @Delete(':produtoId')
  @ApiResponse({ status: 200 })
  async remove(
    @Param('balancoId', ParseIntPipe) balancoId: number,
    @Param('loteId', ParseIntPipe) loteId: number,
    @Param('produtoId', ParseIntPipe) produtoId: number,
  ): Promise<void> {
    return this.service.remove(balancoId, loteId, produtoId);
  }
}
