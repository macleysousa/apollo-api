import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { ApiPessoa } from 'src/decorators/api-pessoa.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { EcommerceReferenciaView } from '../ecommerce-referencia/view/ecommerce-referencia.view';

import { EcommerceCatalogoService } from './ecommerce-catalogo.service';
import { EcommerceCatalogoReferenciaFilter } from './filters/ecommerce-catalogo.filters';

@ApiPessoa()
@ApiBearerAuth()
@ApiTags('E-commerce - Catálogos')
@Controller('e-commerce/:ecommerceId/catalogos')
export class EcommerceCatalogoController {
  constructor(private readonly ecommerceCatalogoService: EcommerceCatalogoService) {}

  @Get('referencias')
  @ApiPaginatedResponse(EcommerceReferenciaView)
  @IsPublic()
  async findReferencias(
    @Param('ecommerceId', ParseIntPipe) ecommerceId: number,
    @Query() filter: EcommerceCatalogoReferenciaFilter,
  ): Promise<any> {
    return this.ecommerceCatalogoService.findReferencias(ecommerceId, filter);
  }
}
