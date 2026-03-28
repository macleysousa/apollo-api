import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { PagamentoAvulsoEntity } from '../entities/pagamento-avulso.entity';

export class PagamentoAvulsoCustomerResponseDto {
  @ApiPropertyOptional()
  nome?: string;

  @ApiPropertyOptional()
  documento?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  telefone?: string;
}

export class PagamentoAvulsoResponseDto extends OmitType(PagamentoAvulsoEntity, [
  'customerNome',
  'customerDocumento',
  'customerEmail',
  'customerTelefone',
] as const) {
  @ApiPropertyOptional({ type: PagamentoAvulsoCustomerResponseDto })
  customer?: PagamentoAvulsoCustomerResponseDto;

  @ApiPropertyOptional({ description: 'URL do site da empresa para pagina de pagamento avulso' })
  urlPagamentoAvulsoSiteEmpresa?: string;
}

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
  @ApiProperty({ type: PagamentoAvulsoResponseDto })
  pagamento: PagamentoAvulsoResponseDto;

  @ApiProperty({ type: GatewayPagamentoAvulsoResponseDto })
  gateway: GatewayPagamentoAvulsoResponseDto;
}
