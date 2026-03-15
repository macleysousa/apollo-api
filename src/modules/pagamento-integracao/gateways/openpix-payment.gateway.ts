import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { appendFile } from 'fs/promises';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { createClient } from '@woovi/node-sdk';

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
export class OpenpixPaymentGateway extends BasePaymentGateway {
    private readonly logger = new Logger(OpenpixPaymentGateway.name);
    private readonly fileLogPath = join(process.cwd(), 'log.txt');

    constructor(
        private readonly http: HttpService,
        private readonly contextService: ContextService,
        private readonly empresaParametroService: EmpresaParametroService,
    ) {
        super();
    }

    provider(): PaymentProvider {
        return 'openpix';
    }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        const correlationID = this.resolveIdempotencyKey(input);

        await this.writeFileLog('createCharge.start', {
            correlationID,
            amount: input.amount,
            customerEmail: input.customer?.email,
        });

        this.logger.log(
            `[createCharge] Iniciando cobranca OpenPix correlationID=${correlationID} amount=${input.amount}`,
        );

        try {
            const { appId, url } = await this.getConfig();
            await this.writeFileLog('createCharge.config', {
                correlationID,
                baseUrl: url,
                appIdConfigured: !!appId,
            });

            const woovi = createClient({ appId, baseUrl: url });

            const result = await woovi.charge.create({
                correlationID,
                value: input.amount,
                comment: input.description,
                customer: {
                    name: input.customer?.nome,
                    email: input.customer?.email,
                    taxID: input.customer?.documento,
                    phone: input.customer?.telefone,
                },
            });

            const charge = result?.charge;

            this.logger.log(
                `[createCharge] Cobranca criada identifier=${charge?.identifier ?? 'N/A'} status=${charge?.status ?? 'N/A'}`,
            );
            await this.writeFileLog('createCharge.success', {
                correlationID,
                identifier: charge?.identifier,
                status: charge?.status,
                brCode: charge?.brCode,
                paymentLinkUrl: charge?.paymentLinkUrl,
            });

            return {
                provider: this.provider(),
                externalId: charge?.identifier ?? charge?.correlationID ?? correlationID,
                status: this.mapStatus(charge?.status),
                qrCode: charge?.brCode ?? charge?.qrCodeImage,
                checkoutUrl: charge?.paymentLinkUrl,
                raw: result,
            };
        } catch (error) {
            this.logger.error(
                `[createCharge] Falha na criacao da cobranca correlationID=${correlationID}: ${error?.message ?? error}`,
            );
            await this.writeFileLog('createCharge.error', {
                correlationID,
                message: error?.message,
                stack: error?.stack,
                data: error?.response?.data,
            });
            throw error;
        }
    }

    async getCharge(externalId: string): Promise<ChargeStatusOutput> {
        await this.writeFileLog('getCharge.start', { externalId });
        this.logger.log(`[getCharge] Consultando cobranca OpenPix externalId=${externalId}`);

        const { appId, url } = await this.getConfig();
        const woovi = createClient({ appId, baseUrl: url });

        const sdkResult = await woovi.charge.get({ id: externalId });
        const sdkCharge = sdkResult?.charge;

        if (sdkCharge) {
            this.logger.log(`[getCharge] SDK retornou status=${sdkCharge?.status ?? 'N/A'} externalId=${externalId}`);
            await this.writeFileLog('getCharge.sdk.success', {
                externalId,
                status: sdkCharge?.status,
                transactionID: sdkCharge?.transactionID,
            });
            return {
                provider: this.provider(),
                externalId,
                status: this.mapStatus(sdkCharge?.status),
                paidAt: sdkCharge?.updatedAt ? new Date(sdkCharge.updatedAt) : undefined,
                raw: sdkResult,
            };
        }

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

        this.logger.log(`[getCharge] Fallback HTTP retornou status=${charge?.status ?? 'N/A'} externalId=${externalId}`);
        await this.writeFileLog('getCharge.http.success', {
            externalId,
            status: charge?.status,
            paidAt: charge?.paidAt,
        });

        return {
            provider: this.provider(),
            externalId,
            status: this.mapStatus(charge?.status),
            paidAt: charge?.paidAt ? new Date(charge.paidAt) : undefined,
            raw: data,
        };
    }

    async cancelCharge(externalId: string): Promise<void> {
        await this.writeFileLog('cancelCharge.start', { externalId });
        const { url, appId } = await this.getConfig();

        await firstValueFrom(
            this.http.delete(`${url}/api/v1/charge/${externalId}`, {
                headers: {
                    Authorization: appId,
                },
            }),
        ).catch((error) => {
            this.writeFileLog('cancelCharge.error', {
                externalId,
                message: error?.message,
                data: error?.response?.data,
            });
            throw new BadRequestException('Falha ao cancelar cobranca no OpenPix.', {
                description: error?.response?.data ?? error?.message,
            });
        });

        await this.writeFileLog('cancelCharge.success', { externalId });
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

    private async getConfig(): Promise<{ url: string; appId: string }> {
        const url = this.resolveOpenPixBaseUrl();
        const appId = await this.getAppIdByCompanyParam();
        await this.writeFileLog('getCharge.http.success', {

            url: url ?? 'falta',
            appId: appId,
        });
        if (!url || !appId) {
            throw new BadRequestException(
                'OpenPix nao configurado para a empresa. Defina OPENPIX_BASE_URL e o parametro INTEGRACAO_OPEN_PIX_APP_ID na empresa.',
            );
        }

        return { url, appId };
    }

    private resolveOpenPixBaseUrl(): string | undefined {
        const baseUrl = process.env.OPEN_PIX_BASE_URL;
        const testUrl = process.env.OPEN_PIX_BASE_URL_TEST;

        // Auto-switch to test URL when process is running in debug mode.
        const isDebugMode = process.execArgv.some((arg) => arg.includes('--inspect'));

        if (isDebugMode && testUrl) {
            return testUrl;
        }

        return baseUrl;
    }

    private async getAppIdByCompanyParam(): Promise<string> {
        const empresaId = this.contextService.empresaId();

        const integracaoHabilitada = await this.empresaParametroService.findByParametroId(
            empresaId,
            ParametroEnum.INTEGRACAO_OPEN_PIX_HABILITADA,
        );

        if (integracaoHabilitada?.valor && integracaoHabilitada.valor !== 'S') {
            throw new BadRequestException('Integracao OpenPix desabilitada para esta empresa.');
        }

        const appIdParametro = await this.empresaParametroService.findByParametroId(
            empresaId,
            ParametroEnum.INTEGRACAO_OPEN_PIX_APP_ID,
        );

        if (!appIdParametro?.valor) {
            throw new BadRequestException('Parametro INTEGRACAO_OPEN_PIX_APP_ID nao configurado para esta empresa.');
        }

        return appIdParametro.valor;
    }

    private mapStatus(status: string): 'pending' | 'paid' | 'cancelled' | 'failed' {
        const value = (status ?? '').toUpperCase();

        if (['COMPLETED', 'PAID', 'CONFIRMED'].includes(value)) return 'paid';
        if (['CANCELLED', 'CANCELED', 'EXPIRED'].includes(value)) return 'cancelled';
        if (['FAILED', 'ERROR'].includes(value)) return 'failed';

        return 'pending';
    }

    private resolveIdempotencyKey(input: CreateChargeInput): string {
        return String(input.metadata?.pagamentoAvulsoId ?? input.externalReference);
    }

    private async writeFileLog(event: string, payload: unknown): Promise<void> {
        const line = `[${new Date().toISOString()}] [OpenPixGateway] ${event} ${this.safeStringify(payload)}\n`;

        await appendFile(this.fileLogPath, line, 'utf8').catch(() => {
            // Never break payment flow because of file logging failure.
        });
    }

    private safeStringify(payload: unknown): string {
        try {
            return JSON.stringify(payload);
        } catch {
            return String(payload);
        }
    }
}
