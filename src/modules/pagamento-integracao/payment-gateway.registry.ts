import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PaymentGateway, PaymentProvider } from './contracts/payment-gateway.interface';
import { PAYMENT_GATEWAYS } from './payment-integration.constants';

@Injectable()
export class PaymentGatewayRegistry {
    private readonly gatewayMap: Map<PaymentProvider, PaymentGateway>;

    constructor(@Inject(PAYMENT_GATEWAYS) gateways: PaymentGateway[]) {
        this.gatewayMap = new Map(gateways.map((gateway) => [gateway.provider(), gateway]));
    }

    get(provider: PaymentProvider): PaymentGateway {
        const gateway = this.gatewayMap.get(provider);

        if (!gateway) {
            throw new NotFoundException(`Gateway de pagamento '${provider}' nao configurado.`);
        }

        return gateway;
    }

    listProviders(): PaymentProvider[] {
        return [...this.gatewayMap.keys()];
    }
}
