import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../componente/decorator/componente.decorator';
import { EstoqueService } from './estoque.service';

@ApiTags('Estoque')
@Controller('estoque')
@ApiBearerAuth()
@ApiComponent('PRDFL001', 'Consultar estoque do produto')
export class EstoqueController {
  constructor(private readonly service: EstoqueService) {}
}
