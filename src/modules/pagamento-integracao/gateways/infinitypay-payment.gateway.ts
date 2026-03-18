import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { appendFile } from 'fs/promises';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';

import { ContextService } from 'src/context/context.service';
import { EmpresaParametroService } from 'src/modules/empresa/parametro/parametro.service';
import { ParametroEnum } from 'src/modules/parametro/enum/parametros';

import { BasePaymentGateway } from '../contracts/base-payment-gateway.abstract';
import {
    ChargeStatusOutput,
    CreateChargeInput,
    CreateChargeOutput,
    PaymentProvider,
    WebhookEvent,
} from '../contracts/payment-gateway.interface';

@Injectable()
export class InfinityPayPaymentGateway extends BasePaymentGateway {
    private readonly infinityPayLogPath = join(process.cwd(), 'log_infinitypay.txt');

    constructor(
        private readonly http: HttpService,
        private readonly contextService: ContextService,
        private readonly empresaParametroService: EmpresaParametroService,
    ) {
        super();
    }
    provider(): PaymentProvider {
        return 'infinitypay';
    }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        const config = await this.getConfig();
        const orderNsu = this.resolveOrderNsu(input);

        const body = {
            handle: config.handle,
            redirect_url: config.redirectUrl,
            webhook_url: config.webhookUrl,
            order_nsu: orderNsu,
            customer: {
                name: input.customer?.nome,
                email: input.customer?.email,
                phone_number: input.customer?.telefone,
            },
            items: [
                {
                    quantity: 1,
                    price: input.amount,
                    description: input.description,
                },
            ],
            metadata: input.metadata,
        };

        try {
            await this.logInfinityPayRequest('POST', `${config.baseUrl}/invoices/public/checkout/links`, body, {
                'Content-Type': 'application/json',
            });

            const { data } = await firstValueFrom(
                this.http.post(`${config.baseUrl}/invoices/public/checkout/links`, body, {
                    headers: { 'Content-Type': 'application/json' },
                }),
            );



            return {
                provider: this.provider(),
                externalId: orderNsu,
                status: 'pending',
                checkoutUrl: data.url,
                qrCode: null,
                raw: data,
            };
        } catch (error) {
            await this.logInfinityPayRequest('POST', `${config.baseUrl}/invoices/public/checkout/links/error`, {
                order_nsu: orderNsu,
                error: (error as any)?.response?.data ?? this.normalizeError(error).message,
            });

            throw new BadRequestException('Falha ao criar cobranca no InfinityPay.', {
                description: (error as any)?.response?.data ?? this.normalizeError(error).message,
            });
        }
    }

    async getCharge(externalId: string): Promise<ChargeStatusOutput> {
        const config = await this.getConfig();
        const body = {
            handle: config.handle,
            order_nsu: externalId,
        };

        try {
            await this.logInfinityPayRequest('POST', `${config.baseUrl}/invoices/public/checkout/payment_check`, body);

            const { data } = await firstValueFrom(this.http.post(`${config.baseUrl}/invoices/public/checkout/payment_check`, body));
            const charge = data;
            const status = this.resolveStatus(charge);

            return {
                provider: this.provider(),
                externalId,
                status,
                paidAt: charge?.paid_at ? new Date(charge.paid_at) : status === 'paid' ? new Date() : undefined,
                raw: data,
            };
        } catch (error) {
            throw new BadRequestException('Falha ao consultar cobranca no InfinityPay.', {
                description: (error as any)?.response?.data ?? this.normalizeError(error).message,
            });
        }
    }

    async cancelCharge(externalId: string): Promise<void> {

    }

    async parseWebhook(payload: any, _headers: Record<string, string | string[]>): Promise<WebhookEvent> {
        const charge = payload?.invoice ?? payload?.charge ?? payload;
        const status = this.resolveStatus(charge);

        return {
            provider: this.provider(),
            event: payload?.event ?? 'infinitypay.webhook',
            externalId: String(charge?.order_nsu ?? charge?.invoice_slug ?? charge?.id ?? charge?.invoice_id ?? 'unknown'),
            status,
            payload,
        };
    }

    private async getConfig(): Promise<{
        baseUrl: string;
        handle: string;
        redirectUrl?: string;
        webhookUrl?: string;
    }> {
        const empresaId = this.contextService.empresaId();

        const integracaoHabilitada = await this.empresaParametroService.findByParametroId(
            empresaId,
            ParametroEnum.INTEGRACAO_INFINITY_PAY_HABILITADA,
        );

        if (integracaoHabilitada?.valor && integracaoHabilitada.valor !== 'S') {
            throw new BadRequestException('Integracao InfinityPay desabilitada para esta empresa.');
        }

        const handle = await this.getParametroValor(empresaId, ParametroEnum.INTEGRACAO_INFINITY_PAY_API_HANDLE);
        if (!handle) {
            throw new BadRequestException('Parametro INTEGRACAO_INFINITY_PAY_API_HANDLE nao configurado para esta empresa.');
        }

        const redirectUrl = await this.getParametroValor(empresaId, ParametroEnum.INTEGRACAO_INFINITY_PAY_URL_REDIRECT);
        const webhookUrl = await this.getParametroValor(empresaId, ParametroEnum.INTEGRACAO_INFINITY_PAY_URL_WEBHOOK);

        return {
            baseUrl: process.env.INFINITY_PAY_BASE_URL ?? 'https://api.infinitepay.io',
            handle,
            redirectUrl,
            webhookUrl,
        };
    }

    private async getParametroValor(empresaId: number, parametroId: ParametroEnum): Promise<string | undefined> {
        const parametro = await this.empresaParametroService.findByParametroId(empresaId, parametroId);
        return parametro?.valor?.trim() || undefined;
    }

    private resolveOrderNsu(input: CreateChargeInput): string {
        const rawOrderNsu = input.metadata?.pagamentoAvulsoId ?? input.externalReference;
        const orderNsu = String(rawOrderNsu ?? '').trim();

        if (!orderNsu || orderNsu.toLowerCase() === 'undefined' || orderNsu.toLowerCase() === 'null') {
            throw new BadRequestException('Nao foi possivel definir order_nsu para enviar ao InfinityPay.');
        }

        return orderNsu;
    }

    private async logInfinityPayRequest(
        method: 'POST' | 'DELETE',
        url: string,
        payload?: Record<string, any>,
        headers?: Record<string, string>,
    ): Promise<void> {
        const logLine = JSON.stringify({
            timestamp: new Date().toISOString(),
            method,
            url,
            headers,
            payload,
        });

        await appendFile(this.infinityPayLogPath, `${logLine}\n`).catch(() => undefined);
    }


    private resolveStatus(charge: any): 'pending' | 'paid' | 'cancelled' | 'failed' {
        const rawStatus = String(charge?.status ?? charge?.payment_status ?? '').toUpperCase();
        const amount = this.parseNumericValue(charge?.amount);
        const paidAmount = this.parseNumericValue(charge?.paid_amount ?? charge?.paidAmount);
        const hasTransaction = Boolean(charge?.transaction_nsu ?? charge?.transaction_id ?? charge?.transactionId);

        if (['CANCELLED', 'CANCELED', 'VOIDED', 'REFUNDED'].includes(rawStatus)) {
            return 'cancelled';
        }

        if (['FAILED', 'ERROR', 'DENIED'].includes(rawStatus)) {
            return 'failed';
        }

        if (['PAID', 'COMPLETED', 'APPROVED', 'AUTHORIZED'].includes(rawStatus)) {
            return 'paid';
        }

        if ((charge?.success === true || paidAmount > 0 || hasTransaction) && (amount <= 0 || paidAmount >= amount || hasTransaction)) {
            return 'paid';
        }

        return 'pending';
    }

    private parseNumericValue(value: unknown): number {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }

        if (typeof value === 'string') {
            const normalized = value.replace(',', '.').replace(/[^0-9.-]/g, '');
            const parsed = Number(normalized);

            return Number.isFinite(parsed) ? parsed : 0;
        }

        return 0;
    }
}