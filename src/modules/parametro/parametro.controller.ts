import { Controller, Get, Body } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { ParametroService } from './parametro.service';
import { ParametroEntity } from './entities/parametro.entity';

@Controller('parametro')
export class ParametroController {
  constructor(private readonly service: ParametroService) {}

  @Get()
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'descricao', required: false })
  async find(@Body('id') id?: string, @Body('descricao') descricao?: string): Promise<ParametroEntity[]> {
    return this.service.find(id, descricao);
  }
}
