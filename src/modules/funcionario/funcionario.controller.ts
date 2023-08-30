import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { FuncionarioEntity } from './entities/funcionario.entity';
import { ApiComponent } from '../../decorators/api-componente.decorator';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Funcionários')
@Controller('funcionarios')
@ApiComponent('FUNFM001', 'Manutenção de funcionários')
export class FuncionarioController {
  constructor(private readonly service: FuncionarioService) {}

  @Post()
  @ApiResponse({ status: 201, type: FuncionarioEntity })
  async create(@Body() createFuncionarioDto: CreateFuncionarioDto): Promise<FuncionarioEntity> {
    return this.service.create(createFuncionarioDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [FuncionarioEntity] })
  @ApiQuery({ name: 'empresaId', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'inativo', required: false, type: Boolean })
  async find(
    @Query('empresaId') empresaId: number,
    @Query('nome') nome: string,
    @Query('inativo') inativo: boolean
  ): Promise<FuncionarioEntity[]> {
    return this.service.find(empresaId, nome, inativo);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: FuncionarioEntity })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<FuncionarioEntity> {
    return this.service.findById(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: FuncionarioEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFuncionarioDto: UpdateFuncionarioDto) {
    return this.service.update(id, updateFuncionarioDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: FuncionarioEntity })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
