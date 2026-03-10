import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PagamentoAvulsoEntity } from '../entities/pagamento-avulso.entity';

export class GatewayPagamentoAvulsoResponseDto {
    @ApiProperty()
    provider: string;

    @ApiPropertyOptional()
    externalId?: string;

    @ApiPropertyOptional()
    status?: string;

    @ApiPropertyOptional()
    checkoutUrl?: string;

    @ApiPropertyOptional({ description: 'PIX copia e cola (brCode)' })
    pixCopiaECola?: string;

    @ApiPropertyOptional()
    qrCodeImage?: string;

    @ApiPropertyOptional()
    txid?: string;

    @ApiPropertyOptional({ type: Object })
    raw?: unknown;
}

export class CreatePagamentoAvulsoResponseDto {
    @ApiProperty({ type: PagamentoAvulsoEntity })
    pagamento: PagamentoAvulsoEntity;

    @ApiProperty({ type: GatewayPagamentoAvulsoResponseDto })
    gateway: GatewayPagamentoAvulsoResponseDto;
}
