import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

import { PaymentProvider } from '../contracts/payment-gateway.interface';

class PagamentoAvulsoCustomerDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    nome?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    documento?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    telefone?: string;
}

export class CreatePagamentoAvulsoDto {
    @ApiProperty({ enum: ['noop', 'openpix', 'infinitypay'] })
    @IsNotEmpty()
    @IsIn(['noop', 'openpix', 'infinitypay'])
    provider: PaymentProvider;

    @ApiProperty({ description: 'Valor em centavos' })
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ description: 'Identificador externo de negocio (pedido, venda, etc.)' })
    @IsOptional()
    @IsString()
    externalReference?: string;

    @ApiPropertyOptional({ description: 'Chave de idempotencia para evitar duplicidade' })
    @IsOptional()
    @IsUUID()
    idempotencyKey?: string;

    @ApiPropertyOptional({ type: PagamentoAvulsoCustomerDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PagamentoAvulsoCustomerDto)
    customer?: PagamentoAvulsoCustomerDto;

    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}
