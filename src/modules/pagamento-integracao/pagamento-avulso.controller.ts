import { Body, Controller, Get, Headers, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { ApiEmpresaAuth } from '../../decorators/api-empresa-auth.decorator';
import { IsPublic } from '../../decorators/is-public.decorator';

import { PaymentProvider } from './contracts/payment-gateway.interface';
import { CreatePagamentoAvulsoDto } from './dto/create-pagamento-avulso.dto';
import { CreatePagamentoAvulsoResponseDto } from './dto/create-pagamento-avulso.response.dto';
import { CancelarPagamentoAvulsoDto } from './dto/update-pagamento-status.dto';
import { PagamentoAvulsoEntity } from './entities/pagamento-avulso.entity';
import { PagamentoAvulsoStatus } from './enum/pagamento-avulso-status.enum';
import { PagamentoAvulsoService } from './pagamento-avulso.service';
import { PagamentoIntegracaoService } from './pagamento-integracao.service';

@ApiTags('Pagamentos Avulsos')
@Controller('pagamentos-avulsos')
@ApiBearerAuth()
@ApiEmpresaAuth()
export class PagamentoAvulsoController {
    constructor(
        private readonly pagamentoAvulsoService: PagamentoAvulsoService,
        private readonly pagamentoIntegracaoService: PagamentoIntegracaoService,
    ) {}

    @Get('providers')
    @ApiOperation({ summary: 'Lista gateways de pagamento configurados' })
    @ApiOkResponse({ type: [String] })
    listProviders() {
        return this.pagamentoIntegracaoService.listProviders();
    }

    @Get()
    @ApiOperation({ summary: 'Lista historico de pagamentos avulsos' })
    @ApiQuery({ name: 'status', required: false, enum: PagamentoAvulsoStatus })
    @ApiOkResponse({ type: [PagamentoAvulsoEntity] })
    async list(@Query('status') status?: PagamentoAvulsoStatus) {
        return this.pagamentoAvulsoService.list(status);
    }

    @Get('pendentes')
    @ApiOperation({ summary: 'Lista pagamentos avulsos pendentes' })
    @ApiOkResponse({ type: [PagamentoAvulsoEntity] })
    async listPendentes() {
        return this.pagamentoAvulsoService.listPendentes();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca pagamento avulso por ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: PagamentoAvulsoEntity })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.pagamentoAvulsoService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Cria um pagamento avulso e inicia cobranca no gateway' })
    @ApiBody({ type: CreatePagamentoAvulsoDto })
    @ApiCreatedResponse({ type: CreatePagamentoAvulsoResponseDto })
    async create(@Body() dto: CreatePagamentoAvulsoDto) {
        return this.pagamentoAvulsoService.create(dto);
    }

    @Post(':id/retry-cobranca')
    @ApiOperation({ summary: 'Tenta novamente criar cobranca no gateway para pagamento com erro de integracao' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: CreatePagamentoAvulsoResponseDto })
    async retryCharge(@Param('id', ParseIntPipe) id: number) {
        return this.pagamentoAvulsoService.retryCharge(id);
    }

    @Patch(':id/sincronizar')
    @ApiOperation({ summary: 'Sincroniza status do pagamento com gateway' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: PagamentoAvulsoEntity })
    async syncStatus(@Param('id', ParseIntPipe) id: number) {
        return this.pagamentoAvulsoService.syncStatus(id);
    }

    @Patch(':id/cancelar')
    @ApiOperation({ summary: 'Cancela pagamento avulso' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: CancelarPagamentoAvulsoDto })
    @ApiOkResponse({ type: PagamentoAvulsoEntity })
    async cancel(@Param('id', ParseIntPipe) id: number, @Body() dto: CancelarPagamentoAvulsoDto) {
        return this.pagamentoAvulsoService.cancelById(id, dto);
    }

    @Patch(':id/marcar-pago')
    @ApiOperation({ summary: 'Marca pagamento avulso como pago manualmente' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: PagamentoAvulsoEntity })
    async markAsPaid(@Param('id', ParseIntPipe) id: number) {
        return this.pagamentoAvulsoService.markAsPaid(id);
    }

    @Get('gateway/:provider/:externalId')
    @ApiOperation({ summary: 'Consulta status direto no gateway' })
    @ApiParam({ name: 'provider', enum: ['noop', 'openpix', 'infinitypay'] })
    @ApiParam({ name: 'externalId', type: String })
    @ApiOkResponse({ description: 'Status retornado pelo gateway' })
    async getChargeStatus(@Param('provider') provider: PaymentProvider, @Param('externalId') externalId: string) {
        return this.pagamentoIntegracaoService.getCharge(provider, externalId);
    }

    @Post('webhook/:provider')
    @IsPublic()
    @ApiOperation({ summary: 'Recebe webhook de atualizacao de status do gateway' })
    @ApiParam({ name: 'provider', enum: ['noop', 'openpix', 'infinitypay'] })
    @ApiResponse({ status: 200 })
    async webhook(
        @Param('provider') provider: PaymentProvider,
        @Body() payload: unknown,
        @Headers() headers: Record<string, string | string[]>,
    ) {
        return this.pagamentoAvulsoService.handleWebhook(provider, payload, headers);
    }
}
