import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

import { CaixaContagemService } from './contagem.service';
import { CreateCaixaContagemDto } from './dto/create-contagem.dto';
import { CaixaContagemEntity } from './entities/contagem.entity';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Caixas - Contagem')
@Controller('caixas/:caixaId/contagem')
@ApiComponent('FCXFM002', 'Manutenção de caixa - Contagem')
export class CaixaContagemController {
  constructor(private readonly service: CaixaContagemService) {}

  @Post()
  @ApiResponse({ status: 201 })
  async create(@Param('caixaId', ParseIntPipe) caixaId: number, @Body() dto: CreateCaixaContagemDto) {
    return this.service.create(caixaId, dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: CaixaContagemEntity })
  async find(@CurrentBranch() empresa: EmpresaEntity, @Param('caixaId', ParseIntPipe) caixaId: number) {
    return this.service.find(empresa.id, caixaId);
  }

  @Put()
  @ApiResponse({ status: 200 })
  async update(@Param('caixaId', ParseIntPipe) caixaId: number, @Body() dto: CreateCaixaContagemDto) {
    return this.service.update(caixaId, dto);
  }

  @Delete()
  @ApiResponse({ status: 200 })
  async remove(@Param('caixaId', ParseIntPipe) caixaId: number) {
    return this.service.remove(caixaId);
  }

  @Post('encerrar')
  @ApiResponse({ status: 200 })
  async encerrar(@Param('caixaId', ParseIntPipe) caixaId: number) {
    return this.service.encerrar(caixaId);
  }
}
