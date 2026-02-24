import { Pagination } from 'nestjs-typeorm-paginate';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

import { BalancoService } from './balanco.service';
import { CancelarBalancoDto } from './dto/cancelar-balanco.dto';
import { CreateBalancoDto } from './dto/create-balanco.dto';
import { EncerrarBalancoDto } from './dto/encerrar-balanco.dto';
import { UpdateBalancoDto } from './dto/update-balanco.dto';
import { BalancoEntity } from './entities/balanco.entity';
import { SituacaoBalanco } from './enum/situacao-balanco.enum';

@ApiTags('Balanços')
@Controller('balancos')
@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiComponent('BALFP001', 'Lançamento de balanços')
export class BalancoController {
  constructor(private readonly service: BalancoService) {}

  @Post()
  @ApiResponse({ status: 201, type: BalancoEntity })
  async create(@Body() dto: CreateBalancoDto): Promise<BalancoEntity> {
    return this.service.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(BalancoEntity)
  @ApiQuery({ name: 'situacao', enum: SituacaoBalanco, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Padrão: 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Padrão: 100' })
  async find(
    @Query('situacao') situacao: SituacaoBalanco,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ): Promise<Pagination<BalancoEntity>> {
    return this.service.find(situacao, page, limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: BalancoEntity })
  async findOne(@CurrentBranch() empresa: EmpresaEntity, @Param('id', ParseIntPipe) id: number): Promise<BalancoEntity> {
    return this.service.findById(empresa.id, id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: BalancoEntity })
  async update(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBalancoDto,
  ): Promise<BalancoEntity> {
    return this.service.update(empresa.id, id, dto);
  }

  @Put(':id/encerrar')
  @ApiResponse({ status: 200, type: BalancoEntity })
  async encerrar(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EncerrarBalancoDto,
  ): Promise<BalancoEntity> {
    return this.service.encerrar(empresa.id, id, dto.observacao);
  }

  @Put(':id/cancelar')
  @ApiResponse({ status: 200, type: BalancoEntity })
  async cancelar(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelarBalancoDto,
  ): Promise<BalancoEntity> {
    return this.service.cancelar(empresa.id, id, dto.motivo);
  }

  @Get(':id/resumo')
  @ApiResponse({ status: 200 })
  async resumo(@CurrentBranch() empresa: EmpresaEntity, @Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.service.resumo(empresa.id, id);
  }
}
