import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseEmpresaPipe } from 'src/commons/pipes/parseEmpresa.pipe';
import { ApiComponent } from 'src/modules/componente/decorator/componente.decorator';

import { CreateParametroDto } from './dto/create-parametro.dto';
import { ParametroService } from './parametro.service';
import { EmpresaParametroView } from './views/paramentro.view';

@ApiTags('Empresas Parâmetros')
@Controller('empresas/:empresaId/parametros')
@ApiBearerAuth()
@ApiComponent('ADMFM009', 'Manutenção de parâmetros da empresa')
export class ParametroController {
  constructor(private readonly service: ParametroService) {}

  @Post()
  @ApiResponse({ status: 201, type: EmpresaParametroView })
  create(
    @Param('empresaId', ParseEmpresaPipe) empresaId: number,
    @Body() createParametroDto: CreateParametroDto
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
    @Param('parametroId') parametroId: string
  ): Promise<EmpresaParametroView> {
    return this.service.findByParametroId(empresaId, parametroId);
  }
}
