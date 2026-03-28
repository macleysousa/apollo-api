import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { EcommerceService } from './ecommerce.service';

@ApiTags('E-commerce')
@Controller('e-commerce')
@ApiBearerAuth()
@ApiComponent('ECOFM001', 'Manutenção de e-commerce')
export class EcommerceController {
  constructor(private readonly service: EcommerceService) {}
}
