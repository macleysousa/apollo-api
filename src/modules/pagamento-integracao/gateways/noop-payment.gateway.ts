import { Injectable } from '@nestjs/common';

import { BasePaymentGateway } from '../contracts/base-payment-gateway.abstract';
import {
    ChargeStatusOutput,
    CreateChargeInput,
    CreateChargeOutput,
    PaymentProvider,
    WebhookEvent,
} from '../contracts/payment-gateway.interface';

@Injectable()
export class NoopPaymentGateway extends BasePaymentGateway {
    provider(): PaymentProvider {
        return 'noop';
    }

    async createCharge(input: CreateChargeInput): Promise<CreateChargeOutput> {
        return {
            provider: this.provider(),
            externalId: `noop_${input.externalReference}`,
            status: 'pending',
            raw: input,
        };
    }

    async getCharge(externalId: string): Promise<ChargeStatusOutput> {
        return {
            provider: this.provider(),
            externalId,
            status: 'pending',
        };
    }

    async cancelCharge(_externalId: string): Promise<void> {
        return;
    }

    async parseWebhook(payload: unknown): Promise<WebhookEvent> {
        return {
            provider: this.provider(),
            event: 'noop.webhook',
            externalId: 'noop',
            status: 'pending',
            payload,
        };
    }
}
