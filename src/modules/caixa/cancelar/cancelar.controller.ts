import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseCaixaAbertoPipe } from 'src/commons/pipes/parseCaixa.pipe';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiComponent } from 'src/modules/componente/decorator/componente.decorator';

import { CancelarService } from './cancelar.service';
import { CancelarAdiantamentoDto } from './dto/cancelar-adianteamento.dto';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Caixas - Cancelar')
@Controller('caixas/:caixaId/cancelar')
export class CancelarController {
  constructor(private readonly service: CancelarService) {}

  @Put('adiantamento')
  @ApiComponent('FCXFP003', 'Cancelar adiantamento')
  @ApiResponse({ status: 200, description: 'Adiantamento cancelado com sucesso' })
  async adiantamento(@Param('caixaId', ParseCaixaAbertoPipe) caixaId: number, @Body() dto: CancelarAdiantamentoDto): Promise<void> {
    await this.service.adiantamento(caixaId, dto);
  }
}
