import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { CurrentBranch } from 'src/decorators/current-auth.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';

import { CaixaExtratoEntity } from './entities/extrato.entity';
import { CaixaExtratoService } from './extrato.service';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Caixas - Extrato')
@Controller('caixas/:caixaId/extrato')
@ApiComponent('FCXFL001', 'Consulta de extrato do caixa')
export class CaixaExtratoController {
  constructor(private readonly service: CaixaExtratoService) {}

  @Get()
  @ApiResponse({ status: 200, type: [CaixaExtratoEntity] })
  async find(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('caixaId', ParseIntPipe) caixaId: number,
  ): Promise<CaixaExtratoEntity[]> {
    return this.service.find(empresa.id, caixaId);
  }

  @Get(':documento')
  @ApiResponse({ status: 200, type: CaixaExtratoEntity })
  findByDocumento(
    @CurrentBranch() empresa: EmpresaEntity,
    @Param('caixaId', ParseIntPipe) caixaId: number,
    @Param('documento', ParseIntPipe) documento: number,
  ) {
    return this.service.findByDocumento(empresa.id, caixaId, documento);
  }
}
