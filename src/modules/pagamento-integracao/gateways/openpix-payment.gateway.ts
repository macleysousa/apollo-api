import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { BasePaymentGateway } from '../contracts/base-payment-gateway.abstract';
import {
    ChargeStatusOutput,
    CreateChargeInput,
    CreateChargeOutput,
    PaymentProvider,
    WebhookEvent,
} from '../contracts/payment-gateway.interface';

@Injectable()
export class OpenpixPaymentGateway extends BasePaymentGateway {
    constructor(private readonly http: HttpService) {
        super();
    }

    provider(): PaymentProvider {
        return 'openpix';
    }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        const { url, appId } = this.getConfig();

        const body = {
            correlationID: input.externalReference,
            value: input.amount,
            comment: input.description,
            customer: {
                name: input.customer?.nome,
                email: input.customer?.email,
                taxID: input.customer?.documento,
                phone: input.customer?.telefone,
            },
        };

        const { data } = await firstValueFrom(
            this.http.post(`${url}/api/v1/charge`, body, {
                headers: {
                    Authorization: appId,
                    'Content-Type': 'application/json',
                },
            }),
        ).catch((error) => {
            throw new BadRequestException('Falha ao criar cobranca no OpenPix.', {
                description: error?.response?.data ?? error?.message,
            });
        });

        const charge = data?.charge ?? data;

        return {
            provider: this.provider(),
            externalId: charge?.identifier ?? charge?.correlationID ?? input.externalReference,
            status: this.mapStatus(charge?.status),
            qrCode: charge?.brCode ?? charge?.qrCodeImage,
            checkoutUrl: charge?.paymentLinkUrl,
            raw: data,
        };
    }

    async getCharge(externalId: string): Promise<ChargeStatusOutput> {
        const { url, appId } = this.getConfig();

        const { data } = await firstValueFrom(
            this.http.get(`${url}/api/v1/charge/${externalId}`, {
                headers: {
                    Authorization: appId,
                },
            }),
        ).catch((error) => {
            throw new BadRequestException('Falha ao consultar cobranca no OpenPix.', {
                description: error?.response?.data ?? error?.message,
            });
        });

        const charge = data?.charge ?? data;

        return {
            provider: this.provider(),
            externalId,
            status: this.mapStatus(charge?.status),
            paidAt: charge?.paidAt ? new Date(charge.paidAt) : undefined,
            raw: data,
        };
    }

    async cancelCharge(externalId: string): Promise<void> {
        const { url, appId } = this.getConfig();

        await firstValueFrom(
            this.http.delete(`${url}/api/v1/charge/${externalId}`, {
                headers: {
                    Authorization: appId,
                },
            }),
        ).catch((error) => {
            throw new BadRequestException('Falha ao cancelar cobranca no OpenPix.', {
                description: error?.response?.data ?? error?.message,
            });
        });
    }

    async parseWebhook(payload: any): Promise<WebhookEvent> {
        const charge = payload?.charge ?? payload;

        return {
            provider: this.provider(),
            event: payload?.event ?? 'openpix.webhook',
            externalId: charge?.identifier ?? charge?.correlationID ?? 'unknown',
            status: this.mapStatus(charge?.status),
            payload,
        };
    }

    private getConfig(): { url: string; appId: string } {
        const url = process.env.OPENPIX_BASE_URL;
        const appId = process.env.OPENPIX_APP_ID;

        if (!url || !appId) {
            throw new BadRequestException('OpenPix nao configurado. Defina OPENPIX_BASE_URL e OPENPIX_APP_ID.');
        }

        return { url, appId };
    }

    private mapStatus(status: string): 'pending' | 'paid' | 'cancelled' | 'failed' {
        const value = (status ?? '').toUpperCase();

        if (['COMPLETED', 'PAID', 'CONFIRMED'].includes(value)) return 'paid';
        if (['CANCELLED', 'CANCELED', 'EXPIRED'].includes(value)) return 'cancelled';
        if (['FAILED', 'ERROR'].includes(value)) return 'failed';

        return 'pending';
    }
}
