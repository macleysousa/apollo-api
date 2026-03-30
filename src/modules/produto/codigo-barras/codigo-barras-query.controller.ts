import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ContextService } from 'src/context/context.service';
import { ApiComponent } from 'src/decorators/api-componente.decorator';
import { ApiEmpresaAuth } from 'src/decorators/api-empresa-auth.decorator';
import { EstoqueView } from 'src/modules/estoque/views/estoque.view';

import { CodigoBarrasResumo, CodigoBarrasService } from './codigo-barras.service';

@ApiTags('Produtos')
@Controller('produtos/codigo-barras')
@ApiBearerAuth()
@ApiComponent('PRDFM009', 'Manutenção de codigo de barras')
export class CodigoBarrasQueryController {
    constructor(
        private readonly service: CodigoBarrasService,
        private readonly contextService: ContextService,
    ) {}

    @Get()
    @ApiQuery({ name: 'tipo', required: false, enum: ['EAN13', 'RFID'] })
    async findCodigos(@Query('tipo') tipo?: 'EAN13' | 'RFID'): Promise<CodigoBarrasResumo[]> {
        return this.service.findCodigos(tipo);
    }

    @Get(':codigo/produto')
    @ApiEmpresaAuth()
    async findProdutoByCodigo(@Param('codigo') codigo: string): Promise<EstoqueView> {
        return this.service.findProdutoByCodigo(codigo, this.contextService.empresaId());
    }
}
