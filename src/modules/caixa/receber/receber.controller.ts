import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { ApiComponent } from 'src/modules/componente/decorator/componente.decorator';

import { ReceberAdiantamentoDto } from './dto/receber-adiantamento.dto';
import { ReceberService } from './receber.service';
import { ReceberFaturaDto } from './dto/receber-fatura.dto';
import { ReceberRomaneioDto } from './dto/receber-romaneio.dto';
import { ParseCaixaAbertoPipe } from 'src/commons/pipes/parseCaixa.pipe';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Caixas - Receber')
@Controller('caixas/:caixaId/receber')
@ApiComponent('FCXFP002', 'Processo de Recebimento no Caixa')
export class ReceberController {
  constructor(private readonly service: ReceberService) {}

  @Post('/adiantamento')
  async adiantamento(
    @Param('caixaId', ParseCaixaAbertoPipe) caixaId: number,
    @Body() adiantamentoDto: ReceberAdiantamentoDto
  ): Promise<unknown> {
    return this.service.adiantamento(caixaId, adiantamentoDto);
  }

  @Post('/fatura')
  async fatura(@Param('caixaId', ParseCaixaAbertoPipe) caixaId: number, @Body() faturaDto: ReceberFaturaDto): Promise<void> {
    return this.service.fatura(caixaId, faturaDto);
  }

  @Post('/romaneio')
  async romaneio(@Param('caixaId', ParseCaixaAbertoPipe) caixaId: number, @Body() romaneioDto: ReceberRomaneioDto): Promise<void> {
    return this.service.romaneio(caixaId, romaneioDto);
  }
}
