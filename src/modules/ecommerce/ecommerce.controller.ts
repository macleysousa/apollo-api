import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

import { EcommerceService } from './ecommerce.service';
import { EcommerceReferenciaView } from './ecommerce-referencia/view/ecommerce-referencia.view';

@ApiTags('E-commerce')
@Controller('e-commerce')
@ApiBearerAuth()
@ApiComponent('ECOFM001', 'Manutenção de e-commerce')
export class EcommerceController {
  constructor(private readonly service: EcommerceService) {}
}
