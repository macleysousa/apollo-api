import { Controller, Get, Post, Body, Query, Param, Put, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentBranch } from 'src/decorators/current-auth.decorator';

import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { ApiComponent } from '../componente/decorator/componente.decorator';
import { EmpresaEntity } from '../empresa/entities/empresa.entity';
import { PessoaEntity } from './entities/pessoa.entity';
import { IsEmpresaAuth } from 'src/decorators/is-empresa-auth.decorator';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LiberarEmpresaAcessoDto } from './dto/liberar-empresa-acesso.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@ApiTags('Pessoas')
@Controller('pessoas')
@ApiBearerAuth()
@IsEmpresaAuth()
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
  @ApiQuery({ name: 'searchTerm', required: false })
  @ApiQuery({ name: 'page', required: false, description: 'Value default: 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Value default: 100' })
  async find(
    @Query('searchTerm') searchTerm: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number
  ): Promise<Pagination<PessoaEntity>> {
    return this.service.find(searchTerm, page, limit);
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
