import { Pagination } from 'nestjs-typeorm-paginate';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { EstoqueService } from './estoque.service';
import { EstoqueFilter } from './filters/estoque.filters';
import { EstoqueView } from './views/estoque.view';

@ApiTags('Estoque')
@Controller('estoque')
@ApiBearerAuth()
@ApiComponent('PRDFL001', 'Consultar estoque do produto')
export class EstoqueController {
  constructor(private readonly service: EstoqueService) {}

  @Get('/saldo')
  @ApiPaginatedResponse(EstoqueView)
  async find(@Query() filter: EstoqueFilter): Promise<Pagination<EstoqueView>> {
    return this.service.find(filter);
  }
}
