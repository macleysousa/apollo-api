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
        const idempotencyKey = dto.idempotencyKey ?? randomUUID();
        const externalReference = dto.externalReference ?? idempotencyKey;

        const existente = await this.repository.findOne({ where: { empresaId, idempotencyKey } });
        if (existente) {
            return {
                pagamento: existente,
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

        const input: CreateChargeInput = {
            amount: dto.amount,
            description: dto.description,
            externalReference,
            customer: dto.customer,
            metadata: {
                ...(dto.metadata ?? {}),
                idempotencyKey,
            },
        };

        const charge = await this.pagamentoIntegracaoService.createCharge(dto.provider, input);

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

        const persisted = await this.updateFromCharge(pagamento, charge, input);

        return {
            pagamento: persisted,
            gateway: this.buildGatewayResponse(charge),
        };
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

        if (event.externalId && event.externalId !== 'unknown') {
            const pagamento = await this.repository.findOne({ where: { provider, externalId: event.externalId } });

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
        }

        return event;
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
