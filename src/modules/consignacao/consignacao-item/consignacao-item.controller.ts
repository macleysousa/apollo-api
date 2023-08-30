import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { ConsignacaoItemService } from './consignacao-item.service';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemFilter } from './filters/consignacao-item.filter';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Consignações - Itens')
@Controller('consignacoes-itens')
export class ConsignacaoItemController {
  constructor(private readonly service: ConsignacaoItemService) {}

  @Post()
  @ApiResponse({ status: 200, type: ConsignacaoItemEntity })
  @ApiOperation({ summary: 'CONFC003 - Consultar consignações (itens)' })
  @ApiComponent('CONFC003', 'Consultar consignações (itens)')
  async findAll(@Body() filter: ConsignacaoItemFilter) {
    return this.service.find(filter);
  }
}
