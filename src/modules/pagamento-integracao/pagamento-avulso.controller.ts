import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
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

import { ApiComponent } from '../../decorators/api-componente.decorator';
import { ApiEmpresaAuth } from '../../decorators/api-empresa-auth.decorator';
import { IsPublic } from '../../decorators/is-public.decorator';

import { PaymentProvider } from './contracts/payment-gateway.interface';
import { CreatePagamentoAvulsoDto } from './dto/create-pagamento-avulso.dto';
import { CreatePagamentoAvulsoResponseDto, PagamentoAvulsoResponseDto } from './dto/create-pagamento-avulso.response.dto';
import { CancelarPagamentoAvulsoDto } from './dto/update-pagamento-status.dto';
import { PagamentoAvulsoStatus } from './enum/pagamento-avulso-status.enum';
import { PagamentoAvulsoService } from './pagamento-avulso.service';
import { PagamentoIntegracaoService } from './pagamento-integracao.service';

@ApiTags('Pagamentos Avulsos')
@Controller('pagamentos-avulsos')
@ApiBearerAuth()
@ApiEmpresaAuth()
@ApiComponent('PAGFM001', 'Manutenção de pagamentos avulsos')
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
  @ApiQuery({
    name: 'apagado',
    required: false,
    type: Boolean,
    description: 'true para listar apenas apagados; false para nao apagados',
  })
  @ApiOkResponse({ type: [PagamentoAvulsoResponseDto] })
  async list(@Query('status') status?: PagamentoAvulsoStatus, @Query('apagado') apagado?: string) {
    return this.pagamentoAvulsoService.toResponseList(
      await this.pagamentoAvulsoService.list(status, this.parseBooleanQuery(apagado)),
    );
  }

  @Get('pendentes')
  @ApiOperation({ summary: 'Lista pagamentos avulsos pendentes' })
  @ApiQuery({
    name: 'apagado',
    required: false,
    type: Boolean,
    description: 'true para listar apenas apagados; false para nao apagados',
  })
  @ApiOkResponse({ type: [PagamentoAvulsoResponseDto] })
  async listPendentes(@Query('apagado') apagado?: string) {
    return this.pagamentoAvulsoService.toResponseList(
      await this.pagamentoAvulsoService.listPendentes(this.parseBooleanQuery(apagado)),
    );
  }

  @Get('public/comprovante/:id')
  @IsPublic()
  @ApiOperation({ summary: 'Consulta publica da URL de comprovante por ID do pagamento avulso' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { urlComprovante: 'https://exemplo.com/comprovante/123' } } })
  async getPublicReceiptUrl(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoAvulsoService.findReceiptUrlById(id);
  }

  @Get('public/pagamento/:id')
  @IsPublic()
  @ApiOperation({ summary: 'Consulta publica da URL de pagamento por ID do pagamento avulso' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { urlDePagamento: 'https://exemplo.com/pagamento/123' } } })
  async getPublicPaymentUrl(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoAvulsoService.findPaymentUrlById(id);
  }

  @Get(':id')
  @ApiComponent('PAGFC004', 'Consulta de pagamento avulso por ID')
  @ApiOperation({ summary: 'Busca pagamento avulso por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({
    name: 'apagado',
    required: false,
    type: Boolean,
    description: 'true para buscar pagamento apagado; false para nao apagado',
  })
  @ApiOkResponse({ type: PagamentoAvulsoResponseDto })
  async findById(@Param('id', ParseIntPipe) id: number, @Query('apagado') apagado?: string) {
    return this.pagamentoAvulsoService.toResponse(
      await this.pagamentoAvulsoService.findById(id, this.parseBooleanQuery(apagado)),
    );
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
  @ApiOkResponse({ type: PagamentoAvulsoResponseDto })
  async syncStatus(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoAvulsoService.toResponse(await this.pagamentoAvulsoService.syncStatus(id));
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancela pagamento avulso' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CancelarPagamentoAvulsoDto })
  @ApiOkResponse({ type: PagamentoAvulsoResponseDto })
  async cancel(@Param('id', ParseIntPipe) id: number, @Body() dto: CancelarPagamentoAvulsoDto) {
    return this.pagamentoAvulsoService.toResponse(await this.pagamentoAvulsoService.cancelById(id, dto));
  }

  @Patch(':id/marcar-pago')
  @ApiComponent('PAGFP005', 'Cancelar pagamento avulso manualmente')
  @ApiOperation({ summary: 'Marca pagamento avulso como pago manualmente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PagamentoAvulsoResponseDto })
  async markAsPaid(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoAvulsoService.toResponse(await this.pagamentoAvulsoService.markAsPaid(id));
  }

  @Delete(':id')
  @ApiComponent('PAGFP006', 'Exclusão lógica de pagamento avulso')
  @ApiOperation({ summary: 'Exclui pagamento avulso' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: PagamentoAvulsoResponseDto })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoAvulsoService.toResponse(await this.pagamentoAvulsoService.deleteById(id));
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

  private parseBooleanQuery(value?: string): boolean {
    if (!value) {
      return false;
    }

    return ['1', 'true', 't', 'yes', 'y', 'sim', 's'].includes(value.toLowerCase());
  }
}
