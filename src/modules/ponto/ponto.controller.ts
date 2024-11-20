import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';

import { Role } from '../usuario/enums/usuario-tipo.enum';
import { Roles } from '../usuario/roles.decorator';

import { PontoDTO } from './dto/ponto.dto';
import { PontoEntity } from './entities/ponto.entity';
import { PontoService } from './ponto.service';

@ApiTags('pontos')
@Controller('pontos')
@ApiBearerAuth()
@ApiComponent('FI000001', 'Fidelizacao de clientes')
export class PontoController {
  constructor(private readonly service: PontoService) {}

  @Post()
  @ApiResponse({ type: PontoEntity, status: 201 })
  @Roles(Role.administrador)
  async create(@Body() ponto: PontoDTO): Promise<PontoEntity> {
    return this.service.create(ponto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [PontoEntity] })
  @ApiQuery({ name: 'clienteId', required: true, type: Number })
  @ApiQuery({ name: 'dataDeValidade', required: true, type: Date })
  async find(@Query('clienteId') clienteId: number, @Query('dataDeValidade') dataDeValidade: Date) {
    return this.service.find({
      clienteId,
      dataDeValidade,
    });
  }
}
