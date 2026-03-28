import { Injectable } from '@nestjs/common';

import {
  ChargeStatusOutput,
  CreateChargeInput,
  CreateChargeOutput,
  PaymentProvider,
  WebhookEvent,
} from './contracts/payment-gateway.interface';
import { PaymentGatewayRegistry } from './payment-gateway.registry';

@Injectable()
export class PagamentoIntegracaoService {
  constructor(private readonly gatewayRegistry: PaymentGatewayRegistry) {}

  listProviders(): PaymentProvider[] {
    return this.gatewayRegistry.listProviders();
  }

  async createCharge(provider: PaymentProvider, input: CreateChargeInput): Promise<CreateChargeOutput> {
    return this.gatewayRegistry.get(provider).createCharge(input);
  }

  async getCharge(provider: PaymentProvider, externalId: string): Promise<ChargeStatusOutput> {
    return this.gatewayRegistry.get(provider).getCharge(externalId);
  }

  async cancelCharge(provider: PaymentProvider, externalId: string): Promise<void> {
    return this.gatewayRegistry.get(provider).cancelCharge(externalId);
  }

  async parseWebhook(
    provider: PaymentProvider,
    payload: unknown,
    headers: Record<string, string | string[]>,
  ): Promise<WebhookEvent> {
    return this.gatewayRegistry.get(provider).parseWebhook(payload, headers);
  }
}
