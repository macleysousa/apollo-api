import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseEmpresaPipe } from 'src/commons/pipes/parseEmpresa.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { FormaDePagamentoEntity } from 'src/modules/forma-de-pagamento/entities/forma-de-pagamento.entity';

import { AddEmpresaFormaPagamentoDto } from './dto/add-forma-de-pagamento.dto';
import { EmpresaFormaPagamentoService } from './forma-de-pagamento.service';

@ApiTags('Empresas Formas de Pagamento')
@Controller('empresas/:empresaId/formas-de-pagamento')
@ApiBearerAuth()
@ApiComponent('ADMFM008', 'Manutenção de formas de pagamento da empresa')
export class EmpresaFormaPagamentoController {
  constructor(private readonly service: EmpresaFormaPagamentoService) {}

  @Post()
  @ApiResponse({ status: 201, type: FormaDePagamentoEntity })
  async addFormaDePagamento(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Body() addFormaDePagamentoDto: AddEmpresaFormaPagamentoDto,
  ) {
    return this.service.add(empresaId, addFormaDePagamentoDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [FormaDePagamentoEntity] })
  async find(@Param('empresaId', ParseEmpresaPipe) empresaId: number): Promise<FormaDePagamentoEntity[]> {
    return this.service.find(empresaId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: FormaDePagamentoEntity })
  async findByFormaPagamentoId(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FormaDePagamentoEntity> {
    return this.service.findByFormaPagamentoId(empresaId, id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200 })
  async remove(@Param('empresaId', ParseEmpresaPipe) empresaId: number, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(empresaId, id);
  }
}
