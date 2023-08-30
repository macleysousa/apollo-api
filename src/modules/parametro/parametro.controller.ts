import { Body, Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiQueryEnum } from 'src/decorators/api-query-enum.decorator';

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
  @ApiQueryEnum({ name: 'id', enum: ParametroEnum, required: false })
  @ApiQuery({ name: 'descricao', required: false })
  async find(@Body('id') id?: string, @Body('descricao') descricao?: string): Promise<ParametroEntity[]> {
    return this.service.find(id as Parametro, descricao);
  }
}
