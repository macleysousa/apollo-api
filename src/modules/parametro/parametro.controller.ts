import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { ParametroEntity } from './entities/parametro.entity';
import { Parametro, ParametroEnum } from './enum/parametros';
import { ParametroService } from './parametro.service';

@ApiTags('Parâmetros')
@Controller('parametros')
@ApiBearerAuth()
@ApiComponent('ADMFL001', 'Consultar de parâmetros')
export class ParametroController {
  constructor(private readonly service: ParametroService) {}

  @Get()
  @ApiQuery({ name: 'descricao', required: false })
  @ApiQuery({ name: 'id', required: false })
  async find(@Query('id') id?: string, @Query('descricao') descricao?: string): Promise<ParametroEntity[]> {
    return this.service.find(id as Parametro, descricao);
  }
}
