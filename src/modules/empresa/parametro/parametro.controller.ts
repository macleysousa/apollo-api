import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseEmpresaPipe } from 'src/commons/pipes/parseEmpresa.pipe';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { Parametro } from 'src/modules/parametro/enum/parametros';

import { CreateParametroDto } from './dto/create-parametro.dto';
import { UpdateEmpresaParametroDto } from './dto/update-parametro.dto';
import { EmpresaParametroService } from './parametro.service';
import { EmpresaParametroView } from './views/parametro.view';

@ApiTags('Empresas Parâmetros')
@Controller('empresas/:empresaId/parametros')
@ApiBearerAuth()
@ApiComponent('ADMFM009', 'Manutenção de parâmetros da empresa')
export class EmpresaParametroController {
  constructor(private readonly service: EmpresaParametroService) {}

  @Post()
  @ApiResponse({ status: 201, type: EmpresaParametroView })
  create(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Body() createParametroDto: CreateParametroDto,
  ): Promise<EmpresaParametroView> {
    return this.service.create(empresaId, createParametroDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [EmpresaParametroView] })
  find(@Param('empresaId', ParseEmpresaPipe) empresaId: number): Promise<EmpresaParametroView[]> {
    return this.service.find(empresaId);
  }

  @Get(':parametroId')
  @ApiResponse({ status: 200, type: EmpresaParametroView })
  findByParametroId(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Param('parametroId') parametroId: Parametro,
  ): Promise<EmpresaParametroView> {
    return this.service.findByParametroId(empresaId, parametroId);
  }

  @Put(':parametroId')
  @ApiResponse({ status: 200, type: EmpresaParametroView })
  async update(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Param('parametroId') parametroId: Parametro,
    @Body() updateEmpresaParametroDto: UpdateEmpresaParametroDto,
  ): Promise<EmpresaParametroView> {
    return this.service.update(empresaId, parametroId, updateEmpresaParametroDto);
  }
}
