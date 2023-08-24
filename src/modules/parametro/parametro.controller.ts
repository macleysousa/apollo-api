import { Controller, Get, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ParametroService } from './parametro.service';
import { ParametroEntity } from './entities/parametro.entity';
import { ApiComponent } from '../componente/decorator/componente.decorator';
import { Parametro } from './enum/parametros';

@ApiTags('Parâmetros')
@Controller('parametros')
@ApiBearerAuth()
@ApiComponent('ADMFL001', 'Consultar de parâmetros')
export class ParametroController {
  constructor(private readonly service: ParametroService) {}

  @Get()
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'descricao', required: false })
  async find(@Body('id') id?: string, @Body('descricao') descricao?: string): Promise<ParametroEntity[]> {
    return this.service.find(id as Parametro, descricao);
  }
}
