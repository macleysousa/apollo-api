import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

import { ContextService } from 'src/context/context.service';

import {
    ChargeStatusOutput,
    CreateChargeInput,
    CreateChargeOutput,
    PaymentProvider,
    WebhookEvent,
} from './contracts/payment-gateway.interface';
import { CreatePagamentoAvulsoDto } from './dto/create-pagamento-avulso.dto';
import {
    CreatePagamentoAvulsoResponseDto,
    GatewayPagamentoAvulsoResponseDto,
    PagamentoAvulsoResponseDto,
} from './dto/create-pagamento-avulso.response.dto';
import { CancelarPagamentoAvulsoDto } from './dto/update-pagamento-status.dto';
import { PagamentoAvulsoEntity } from './entities/pagamento-avulso.entity';
import { PagamentoAvulsoStatus } from './enum/pagamento-avulso-status.enum';
import { PagamentoIntegracaoService } from './pagamento-integracao.service';

@Injectable()
export class PagamentoAvulsoService {
    constructor(
        @InjectRepository(PagamentoAvulsoEntity)
        private readonly repository: Repository<PagamentoAvulsoEntity>,
        private readonly contextService: ContextService,
        private readonly pagamentoIntegracaoService: PagamentoIntegracaoService,
    ) {}

    async list(status?: PagamentoAvulsoStatus): Promise<PagamentoAvulsoEntity[]> {
        const empresaId = this.contextService.empresaId();

        return this.repository.find({
            where: {
                empresaId,
                ...(status ? { status } : {}),
            },
            order: { id: 'DESC' },
        });
    }

    async listPendentes(): Promise<PagamentoAvulsoEntity[]> {
        return this.list(PagamentoAvulsoStatus.pending);
    }

    async findById(id: number): Promise<PagamentoAvulsoEntity> {
        const empresaId = this.contextService.empresaId();
        const pagamento = await this.repository.findOne({ where: { id, empresaId } });

        if (!pagamento) {
            throw new NotFoundException(`Pagamento avulso ${id} nao encontrado.`);
        }

        return pagamento;
    }

    async create(dto: CreatePagamentoAvulsoDto): Promise<CreatePagamentoAvulsoResponseDto> {
        const empresaId = this.contextService.empresaId();
        const usuarioId = this.contextService.usuarioId();
        const idempotencyKey = dto.idempotencyKey?.trim() || randomUUID();
        const externalReference = dto.externalReference?.trim() || idempotencyKey;

        const existente = await this.repository.findOne({ where: { empresaId, idempotencyKey } });
        if (existente) {
            return {
                pagamento: this.toResponse(existente),
                gateway: this.buildGatewayResponse({
                    provider: existente.provider,
                    externalId: existente.externalId,
                    status: existente.status,
                    checkoutUrl: this.extractGatewayFields(existente.respostaGateway).checkoutUrl,
                    qrCode: this.extractGatewayFields(existente.respostaGateway).pixCopiaECola,
                    raw: existente.respostaGateway,
                } as CreateChargeOutput),
            };
        }

        const pagamento = await this.repository.save(
            this.repository.create({
                empresaId,
                usuarioId,
                provider: dto.provider,
                status: PagamentoAvulsoStatus.pending,
                amount: dto.amount,
                description: dto.description,
                externalReference,
                idempotencyKey,
                customerNome: dto.customer?.nome,
                customerDocumento: dto.customer?.documento,
                customerEmail: dto.customer?.email,
                customerTelefone: dto.customer?.telefone,
                metadata: dto.metadata,
            }),
        );

        const input = this.buildCreateChargeInput(pagamento);

        try {
            const charge = await this.pagamentoIntegracaoService.createCharge(dto.provider, input);
            const persisted = await this.updateFromCharge(pagamento, charge, input);

            return {
                pagamento: this.toResponse(persisted),
                gateway: this.buildGatewayResponse(charge),
            };
        } catch (error) {
            const persisted = await this.markGatewayError(pagamento, input, error);

            return {
                pagamento: this.toResponse(persisted),
                gateway: {
                    provider: persisted.provider,
                    externalId: persisted.externalId,
                    status: PagamentoAvulsoStatus.gatewayError,
                    raw: persisted.respostaGateway,
                },
            };
        }
    }

    async retryCharge(id: number): Promise<CreatePagamentoAvulsoResponseDto> {
        const pagamento = await this.findById(id);

        if (pagamento.status !== PagamentoAvulsoStatus.gatewayError) {
            return {
                pagamento: this.toResponse(pagamento),
                gateway: this.buildGatewayResponse({
                    provider: pagamento.provider,
                    externalId: pagamento.externalId,
                    status: pagamento.status as CreateChargeOutput['status'],
                    raw: pagamento.respostaGateway,
                }),
            };
        }

        const input = this.buildCreateChargeInput(pagamento);

        try {
            const charge = await this.pagamentoIntegracaoService.createCharge(pagamento.provider, input);
            const persisted = await this.updateFromCharge(pagamento, charge, input);

            return {
                pagamento: this.toResponse(persisted),
                gateway: this.buildGatewayResponse(charge),
            };
        } catch (error) {
            const persisted = await this.markGatewayError(pagamento, input, error);

            return {
                pagamento: this.toResponse(persisted),
                gateway: {
                    provider: persisted.provider,
                    externalId: persisted.externalId,
                    status: PagamentoAvulsoStatus.gatewayError,
                    raw: persisted.respostaGateway,
                },
            };
        }
    }

    async syncStatus(id: number): Promise<PagamentoAvulsoEntity> {
        const pagamento = await this.findById(id);

        if (!pagamento.externalId) {
            return pagamento;
        }

        const charge = await this.pagamentoIntegracaoService.getCharge(pagamento.provider, pagamento.externalId);
        return this.updateFromStatus(pagamento, charge);
    }

    async cancelById(id: number, dto?: CancelarPagamentoAvulsoDto): Promise<PagamentoAvulsoEntity> {
        const pagamento = await this.findById(id);

        if (pagamento.externalId && pagamento.status === PagamentoAvulsoStatus.pending) {
            await this.pagamentoIntegracaoService.cancelCharge(pagamento.provider, pagamento.externalId);
        }

        pagamento.status = PagamentoAvulsoStatus.cancelled;
        pagamento.canceladoEm = new Date();
        pagamento.motivoCancelamento = dto?.motivo ?? pagamento.motivoCancelamento;

        return this.repository.save(pagamento);
    }

    async markAsPaid(id: number): Promise<PagamentoAvulsoEntity> {
        const pagamento = await this.findById(id);
        pagamento.status = PagamentoAvulsoStatus.paid;
        pagamento.pagoEm = pagamento.pagoEm ?? new Date();
        return this.repository.save(pagamento);
    }

    async handleWebhook(
        provider: PaymentProvider,
        payload: unknown,
        headers: Record<string, string | string[]>,
    ): Promise<WebhookEvent> {
        const event = await this.pagamentoIntegracaoService.parseWebhook(provider, payload, headers);
        const gatewayReference = this.extractGatewayReferenceFromWebhook(provider, payload, event.externalId);

        const pagamentoById = gatewayReference && /^\d+$/.test(gatewayReference)
            ? await this.repository.findOne({
                where: { id: Number(gatewayReference), provider },
            })
            : null;

        const pagamentoByIdempotencyKey = gatewayReference
            ? await this.repository.findOne({
                where: { provider, idempotencyKey: gatewayReference },
            })
            : null;

        const pagamento =
            pagamentoById ??
            pagamentoByIdempotencyKey ??
            (event.externalId && event.externalId !== 'unknown'
                ? await this.repository.findOne({
                    where: { provider, externalId: event.externalId },
                })
                : null);

        if (pagamento && event.status) {
            pagamento.status = event.status as PagamentoAvulsoStatus;
            pagamento.respostaGateway = payload;

            if (event.status === PagamentoAvulsoStatus.paid && !pagamento.pagoEm) {
                pagamento.pagoEm = new Date();
            }

            if (event.status === PagamentoAvulsoStatus.cancelled && !pagamento.canceladoEm) {
                pagamento.canceladoEm = new Date();
            }

            await this.repository.save(pagamento);
        }

        return event;
    }

    private extractGatewayReferenceFromWebhook(
        provider: PaymentProvider,
        payload: unknown,
        fallbackExternalId?: string,
    ): string | undefined {
        const data = payload as any;
        const charge = data?.charge ?? data?.invoice ?? data;

        if (provider === 'infinitypay') {
            return (charge?.order_nsu ?? fallbackExternalId)?.toString();
        }

        if (provider === 'openpix') {
            return (
                charge?.correlationID ??
                charge?.correlationId ??
                charge?.metadata?.idempotencyKey ??
                data?.metadata?.idempotencyKey ??
                fallbackExternalId
            )?.toString();
        }

        return fallbackExternalId?.toString();
    }

    private async updateFromCharge(
        pagamento: PagamentoAvulsoEntity,
        charge: CreateChargeOutput,
        requestPayload: CreateChargeInput,
    ): Promise<PagamentoAvulsoEntity> {
        pagamento.externalId = charge.externalId;
        pagamento.status = charge.status as PagamentoAvulsoStatus;
        pagamento.requisicaoGateway = requestPayload;
        pagamento.respostaGateway = charge.raw;

        if (charge.status === PagamentoAvulsoStatus.paid && !pagamento.pagoEm) {
            pagamento.pagoEm = new Date();
        }

        if (charge.status === PagamentoAvulsoStatus.cancelled && !pagamento.canceladoEm) {
            pagamento.canceladoEm = new Date();
        }

        return this.repository.save(pagamento);
    }

    private async markGatewayError(
        pagamento: PagamentoAvulsoEntity,
        requestPayload: CreateChargeInput,
        error: unknown,
    ): Promise<PagamentoAvulsoEntity> {
        pagamento.status = PagamentoAvulsoStatus.gatewayError;
        pagamento.requisicaoGateway = requestPayload;
        pagamento.respostaGateway = this.normalizeGatewayError(error);

        return this.repository.save(pagamento);
    }

    private async updateFromStatus(
        pagamento: PagamentoAvulsoEntity,
        status: ChargeStatusOutput,
    ): Promise<PagamentoAvulsoEntity> {
        pagamento.status = status.status as PagamentoAvulsoStatus;
        pagamento.respostaGateway = status.raw;

        if (status.status === PagamentoAvulsoStatus.paid) {
            pagamento.pagoEm = status.paidAt ?? pagamento.pagoEm ?? new Date();
        }

        if (status.status === PagamentoAvulsoStatus.cancelled && !pagamento.canceladoEm) {
            pagamento.canceladoEm = new Date();
        }

        return this.repository.save(pagamento);
    }

    private buildGatewayResponse(charge: CreateChargeOutput): GatewayPagamentoAvulsoResponseDto {
        const extra = this.extractGatewayFields(charge.raw);

        return {
            provider: charge.provider,
            externalId: charge.externalId,
            status: charge.status,
            checkoutUrl: charge.checkoutUrl ?? extra.checkoutUrl,
            pixCopiaECola: charge.qrCode ?? extra.pixCopiaECola,
            qrCodeImage: extra.qrCodeImage,
            txid: extra.txid,
            raw: charge.raw,
        };
    }

    private buildCreateChargeInput(pagamento: PagamentoAvulsoEntity): CreateChargeInput {
        return {
            amount: pagamento.amount,
            description: pagamento.description,
            externalReference: String(pagamento.id),
            customer: {
                nome: pagamento.customerNome,
                documento: pagamento.customerDocumento,
                email: pagamento.customerEmail,
                telefone: pagamento.customerTelefone,
            },
            metadata: {
                ...(pagamento.metadata ?? {}),
                pagamentoAvulsoId: pagamento.id,
            },
        };
    }

    private normalizeGatewayError(error: unknown): Record<string, unknown> {
        const value = error as any;

        return {
            message: value?.message ?? 'Falha na integracao de pagamento.',
            name: value?.name,
            statusCode: value?.status ?? value?.response?.status,
            description: value?.response?.data ?? value?.description,
        };
    }

    toResponse(pagamento: PagamentoAvulsoEntity): PagamentoAvulsoResponseDto {
        return {
            ...pagamento,
            customer: {
                nome: pagamento.customerNome,
                documento: pagamento.customerDocumento,
                email: pagamento.customerEmail,
                telefone: pagamento.customerTelefone,
            },
        };
    }

    toResponseList(pagamentos: PagamentoAvulsoEntity[]): PagamentoAvulsoResponseDto[] {
        return pagamentos.map((pagamento) => this.toResponse(pagamento));
    }

    private extractGatewayFields(raw: unknown): {
        pixCopiaECola?: string;
        qrCodeImage?: string;
        checkoutUrl?: string;
        txid?: string;
    } {
        const charge = (raw as any)?.charge ?? raw;

        return {
            pixCopiaECola: charge?.brCode,
            qrCodeImage: charge?.qrCodeImage,
            checkoutUrl: charge?.paymentLinkUrl,
            txid: charge?.transactionID ?? charge?.txid,
        };
    }
}
