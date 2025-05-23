import { Pagination } from 'nestjs-typeorm-paginate';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { EmpresaEntity } from '../empresa/entities/empresa.entity';

import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { LiberarEmpresaAcessoDto } from './dto/liberar-empresa-acesso.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoaFilter } from './filters/pessoa.filter';
import { PessoaService } from './pessoa.service';

@ApiTags('Pessoas')
@Controller('pessoas')
@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiComponent('PESFM001', 'Manutenção de pessoa')
export class PessoaController {
  constructor(private readonly service: PessoaService) {}

  @Post()
  @ApiResponse({ status: 201, type: PessoaEntity })
  async create(@CurrentBranch() empresa: EmpresaEntity, @Body() createPessoaDto: CreatePessoaDto): Promise<PessoaEntity> {
    return this.service.create(empresa.id, createPessoaDto);
  }

  @Get()
  @ApiPaginatedResponse(PessoaEntity)
  async find(@Query() filter: PessoaFilter): Promise<Pagination<PessoaEntity>> {
    return this.service.find(filter);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: PessoaEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<PessoaEntity> {
    return this.service.findById(id);
  }

  @Get(':documento/documento')
  @ApiResponse({ status: 200, type: PessoaEntity })
  async findByDocumento(@Param('documento') documento: string): Promise<PessoaEntity> {
    return this.service.findByDocumento(documento);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: PessoaEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePessoaDto: UpdatePessoaDto): Promise<PessoaEntity> {
    return this.service.update(id, updatePessoaDto);
  }

  @Put(':id/bloquear')
  @ApiResponse({ status: 200, type: PessoaEntity })
  async block(@Param('id', ParseIntPipe) id: number): Promise<PessoaEntity> {
    return this.service.block(id);
  }

  @Put(':id/desbloquear')
  @ApiResponse({ status: 200, type: PessoaEntity })
  async unblock(@Param('id', ParseIntPipe) id: number): Promise<PessoaEntity> {
    return this.service.unblock(id);
  }

  @Post(':id/liberar-acesso')
  @ApiResponse({ status: 200, type: PessoaEntity })
  async liberarAcesso(@Param('id', ParseIntPipe) id: number, @Body() dto: LiberarEmpresaAcessoDto): Promise<PessoaEntity> {
    return this.service.liberarAcesso(id, dto.empresaId);
  }
}
