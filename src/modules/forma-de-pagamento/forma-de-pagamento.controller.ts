import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from '../../decorators/api-componente.decorator';

import { CreateFormaDePagamentoDto } from './dto/create-forma-de-pagamento.dto';
import { UpdateFormaDePagamentoDto } from './dto/update-forma-de-pagamento.dto';
import { FormaDePagamentoEntity } from './entities/forma-de-pagamento.entity';
import { FormaDePagamentoService } from './forma-de-pagamento.service';

@ApiTags('Formas de pagamento')
@Controller('formas-de-pagamento')
@ApiBearerAuth()
@ApiComponent('GERFM001', 'Manutenção de formas de pagamento')
export class FormaDePagamentoController {
  constructor(private readonly service: FormaDePagamentoService) {}

  @Post()
  @ApiResponse({ status: 201, type: FormaDePagamentoEntity })
  async create(@Body() createFormaDePagamentoDto: CreateFormaDePagamentoDto): Promise<FormaDePagamentoEntity> {
    return this.service.add(createFormaDePagamentoDto);
  }

  @Get()
  @ApiResponse({ type: [FormaDePagamentoEntity], status: 200 })
  @ApiQuery({ name: 'filter', required: false })
  async find(@Query('filter') filter: string): Promise<FormaDePagamentoEntity[]> {
    return this.service.find(filter);
  }

  @Get(':id')
  @ApiResponse({ type: FormaDePagamentoEntity, status: 200 })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<FormaDePagamentoEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ type: FormaDePagamentoEntity, status: 200 })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateForPagDto: UpdateFormaDePagamentoDto,
  ): Promise<FormaDePagamentoEntity> {
    return this.service.update(id, updateForPagDto);
  }
}
