import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  async create(
    @Param('pessoaId', ParsePessoaPipe) id: number,
    @Body() createPessoaEnderecoDto: CreatePessoaEnderecoDto,
  ): Promise<PessoaEnderecoEntity> {
    return this.service.create(id, createPessoaEnderecoDto);
  }

  @Get()
  findOne(@Param('pessoaId', ParsePessoaPipe) id: number) {
    return this.service.findById(id);
  }

  @Put()
  async update(
    @Param('pessoaId') id: number,
    @Body() updatePessoaEnderecoDto: UpdatePessoaEnderecoDto,
  ): Promise<PessoaEnderecoEntity> {
    return this.service.update(id, updatePessoaEnderecoDto);
  }

  @Delete()
  async delete(@Param('pessoaId') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
