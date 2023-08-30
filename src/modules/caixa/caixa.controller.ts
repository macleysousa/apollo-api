import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { CaixaService } from './caixa.service';
import { CreateCaixaDto } from './dto/create-caixa.dto';
import { CaixaEntity } from './entities/caixa.entity';

@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiTags('Caixas')
@Controller('caixas')
@ApiComponent('FCXFM001', 'Manutenção de caixa')
export class CaixaController {
  constructor(private readonly service: CaixaService) {}

  @Post('/abrir')
  @ApiComponent('FCXFP001', 'Abertura de Caixa')
  @ApiResponse({ status: 201, type: CaixaEntity })
  async open(@Body() createCaixaDto: CreateCaixaDto): Promise<CaixaEntity> {
    return this.service.open(createCaixaDto);
  }
}
