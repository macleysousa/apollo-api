import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from 'src/commons/base.entity';

import { PedidoEntity } from '../../entities/pedido.entity';

@Entity({ name: 'pedidos_itens' })
export class PedidoItemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int', { transformer: { from: (value) => Number(value), to: (value) => value } })
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint', { transformer: { from: (value) => Number(value), to: (value) => value } })
  pedidoId: number;

  @ApiProperty()
  @PrimaryColumn('bigint', { transformer: { from: (value) => Number(value), to: (value) => value } })
  produtoId: number;

  @ApiProperty()
  @PrimaryColumn('int', { transformer: { from: (value) => Number(value), to: (value) => value } })
  sequencia: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => Number(value), to: (value) => value } })
  solicitado: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => Number(value), to: (value) => value } })
  atendido: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => Number(value), to: (value) => value } })
  valorUnitario: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => Number(value), to: (value) => value } })
  valorUnitDesconto: number;

  @ApiProperty()
  @Column('int', { transformer: { from: (value) => Number(value), to: (value) => value } })
  operadorId: number;

  @Exclude()
  @ManyToOne(() => PedidoEntity, (pedido) => pedido.id)
  @JoinColumn({ name: 'pedidoId', referencedColumnName: 'id' })
  pedido: PedidoEntity;

  constructor(partial?: Partial<PedidoItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
