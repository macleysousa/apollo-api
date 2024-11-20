import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { ConsignacaoItemService } from './consignacao-item.service';
import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemFilter } from './filters/consignacao-item.filter';
import { ConsignacaoItemView } from './views/consignacao-item.view';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Consignações - Itens')
@Controller('consignacoes-itens')
export class ConsignacaoItemController {
  constructor(private readonly service: ConsignacaoItemService) {}

  @Post()
  @ApiResponse({ status: 200, type: [ConsignacaoItemView] })
  @ApiOperation({ summary: 'CONFC003 - Consultar consignações (itens)' })
  @ApiComponent('CONFC003', 'Consultar consignações (itens)')
  async find(@Body() filter: ConsignacaoItemFilter): Promise<ConsignacaoItemView[]> {
    return this.service.find(filter);
  }
}
