import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParsePessoaPipe } from 'src/commons/pipes/parsePessoa.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { CreatePessoaEnderecoDto } from './dto/create-pessoa-endereco.dto';
import { UpdatePessoaEnderecoDto } from './dto/update-pessoa-endereco.dto';
import { PessoaEnderecoEntity } from './entities/pessoa-endereco.entity';
import { PessoaEnderecoService } from './pessoa-endereco.service';

@ApiTags('Pessoas Endereços')
@Controller('pessoas/:pessoaId/enderecos')
@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiComponent('PESFM002', 'Manutenção de pessoa endereço')
export class PessoaEnderecoController {
  constructor(private readonly service: PessoaEnderecoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo endereço para a pessoa' })
  @ApiResponse({ type: PessoaEnderecoEntity, status: 201 })
  async create(
    @Param('pessoaId', ParsePessoaPipe) pessoaId: number,
    @Body() createPessoaEnderecoDto: CreatePessoaEnderecoDto,
  ): Promise<PessoaEnderecoEntity> {
    return this.service.create(pessoaId, createPessoaEnderecoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os endereços da pessoa' })
  @ApiResponse({ type: [PessoaEnderecoEntity], status: 200 })
  async findAll(@Param('pessoaId', ParsePessoaPipe) pessoaId: number): Promise<PessoaEnderecoEntity[]> {
    return this.service.findAll(pessoaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar endereço específico' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ type: PessoaEnderecoEntity, status: 200 })
  async findOne(@Param('pessoaId', ParsePessoaPipe) pessoaId: number, @Param('id') id: number): Promise<PessoaEnderecoEntity> {
    return this.service.findById(pessoaId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar endereço específico' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ type: PessoaEnderecoEntity, status: 200 })
  async update(
    @Param('pessoaId', ParsePessoaPipe) pessoaId: number,
    @Param('id') id: number,
    @Body() updatePessoaEnderecoDto: UpdatePessoaEnderecoDto,
  ): Promise<PessoaEnderecoEntity> {
    return this.service.update(pessoaId, id, updatePessoaEnderecoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar endereço específico' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ status: 204 })
  async delete(@Param('pessoaId', ParsePessoaPipe) pessoaId: number, @Param('id') id: number): Promise<void> {
    return this.service.delete(pessoaId, id);
  }
}
