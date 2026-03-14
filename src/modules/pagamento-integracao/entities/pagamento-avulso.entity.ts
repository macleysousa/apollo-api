import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { PaymentProvider } from '../contracts/payment-gateway.interface';
import { PagamentoAvulsoStatus } from '../enum/pagamento-avulso-status.enum';

@Entity({ name: 'pagamentos_avulsos' })
@Index('IDX_pagamentos_avulsos_empresa_status', ['empresaId', 'status'])
@Index('UQ_pagamentos_avulsos_empresa_idempotency', ['empresaId', 'idempotencyKey'], { unique: true })
export class PagamentoAvulsoEntity extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column('int')
    empresaId: number;

    @ApiProperty()
    @Column('int')
    usuarioId: number;

    @ApiProperty({ enum: ['noop', 'openpix', 'infinitypay'] })
    @Column('varchar')
    provider: PaymentProvider;

    @ApiProperty({ enum: PagamentoAvulsoStatus })
    @Column('varchar', { default: PagamentoAvulsoStatus.pending })
    status: PagamentoAvulsoStatus;

    @ApiProperty({ description: 'Valor em centavos' })
    @Column('int')
    amount: number;

    @ApiProperty()
    @Column('varchar', { length: 500 })
    description: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 120, nullable: true })
    externalReference?: string;

    @ApiProperty()
    @Column('varchar', { length: 64 })
    idempotencyKey: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 150, nullable: true })
    externalId?: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 120, nullable: true })
    customerNome?: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 40, nullable: true })
    customerDocumento?: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 120, nullable: true })
    customerEmail?: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 30, nullable: true })
    customerTelefone?: string;

    @ApiPropertyOptional()
    @Column('json', { nullable: true })
    metadata?: Record<string, any>;

    @ApiPropertyOptional()
    @Column('json', { nullable: true })
    requisicaoGateway?: unknown;

    @ApiPropertyOptional()
    @Column('json', { nullable: true })
    respostaGateway?: unknown;

    @ApiPropertyOptional()
    @Column('text', { nullable: true })
    qrCodePix?: string;

    @ApiPropertyOptional()
    @Column('text', { nullable: true })
    chavePixCopiaECola?: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 500, nullable: true })
    urlDePagamento?: string;

    @ApiPropertyOptional()
    @Column('varchar', { length: 500, nullable: true })
    urlComprovante?: string;

    @ApiProperty({ default: false })
    @Column('boolean', { default: false })
    apagado: boolean;

    @ApiPropertyOptional()
    @Column('datetime', { nullable: true })
    apagadoEm?: Date;

    @ApiPropertyOptional()
    @Column('datetime', { nullable: true })
    pagoEm?: Date;

    @ApiPropertyOptional()
    @Column('datetime', { nullable: true })
    canceladoEm?: Date;

    @ApiPropertyOptional()
    @Column('varchar', { length: 500, nullable: true })
    motivoCancelamento?: string;
}
