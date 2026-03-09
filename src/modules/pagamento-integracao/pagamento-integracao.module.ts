import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentGateway } from './contracts/payment-gateway.interface';
import { NoopPaymentGateway } from './gateways/noop-payment.gateway';
import { OpenpixPaymentGateway } from './gateways/openpix-payment.gateway';
import { PagamentoAvulsoController } from './pagamento-avulso.controller';
import { PagamentoAvulsoService } from './pagamento-avulso.service';
import { PagamentoAvulsoEntity } from './entities/pagamento-avulso.entity';
import { PaymentGatewayRegistry } from './payment-gateway.registry';
import { PAYMENT_GATEWAYS } from './payment-integration.constants';
import { PagamentoIntegracaoService } from './pagamento-integracao.service';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([PagamentoAvulsoEntity])],
    controllers: [PagamentoAvulsoController],
    providers: [
        NoopPaymentGateway,
        OpenpixPaymentGateway,
        {
            provide: PAYMENT_GATEWAYS,
            useFactory: (noopGateway: NoopPaymentGateway, openpixGateway: OpenpixPaymentGateway): PaymentGateway[] => [noopGateway, openpixGateway],
            inject: [NoopPaymentGateway, OpenpixPaymentGateway],
        },
        PaymentGatewayRegistry,
        PagamentoIntegracaoService,
        PagamentoAvulsoService,
    ],
    exports: [PaymentGatewayRegistry, PagamentoIntegracaoService, PagamentoAvulsoService],
})
export class PagamentoIntegracaoModule {
    static forRoot(): DynamicModule {
        return {
            global: true,
            module: this,
        };
    }
}
