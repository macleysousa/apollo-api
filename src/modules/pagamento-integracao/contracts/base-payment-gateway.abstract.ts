import {
    ChargeStatusOutput,
    CreateChargeInput,
    CreateChargeOutput,
    PaymentGateway,
    PaymentProvider,
    WebhookEvent,
} from './payment-gateway.interface';

export abstract class BasePaymentGateway implements PaymentGateway {
    abstract provider(): PaymentProvider;

    abstract createCharge(input: CreateChargeInput): Promise<CreateChargeOutput>;

    abstract getCharge(externalId: string): Promise<ChargeStatusOutput>;

    abstract cancelCharge(externalId: string): Promise<void>;

    abstract parseWebhook(payload: unknown, headers: Record<string, string | string[]>): Promise<WebhookEvent>;

    protected normalizeError(error: unknown): Error {
        if (error instanceof Error) {
            return error;
        }

        return new Error('Falha na integracao de pagamento.');
    }
}
