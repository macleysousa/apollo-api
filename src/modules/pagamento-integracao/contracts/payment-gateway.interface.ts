export type PaymentProvider = 'noop' | 'openpix';

export type CreateChargeInput = {
    amount: number;
    description: string;
    externalReference: string;
    customer?: {
        nome?: string;
        documento?: string;
        email?: string;
        telefone?: string;
    };
    metadata?: Record<string, any>;
};

export type CreateChargeOutput = {
    provider: PaymentProvider;
    externalId: string;
    status: 'pending' | 'paid' | 'cancelled' | 'failed';
    checkoutUrl?: string;
    qrCode?: string;
    raw?: unknown;
};

export type ChargeStatusOutput = {
    provider: PaymentProvider;
    externalId: string;
    status: 'pending' | 'paid' | 'cancelled' | 'failed';
    paidAt?: Date;
    raw?: unknown;
};

export type WebhookEvent = {
    provider: PaymentProvider;
    event: string;
    externalId: string;
    status?: 'pending' | 'paid' | 'cancelled' | 'failed';
    payload: unknown;
};

export interface PaymentGateway {
    provider(): PaymentProvider;
    createCharge(input: CreateChargeInput): Promise<CreateChargeOutput>;
    getCharge(externalId: string): Promise<ChargeStatusOutput>;
    cancelCharge(externalId: string): Promise<void>;
    parseWebhook(payload: unknown, headers: Record<string, string | string[]>): Promise<WebhookEvent>;
}
