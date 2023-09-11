import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { Exclude } from 'class-transformer';
import { PedidoEntity } from '../../entities/pedido.entity';

@Entity({ name: 'pedidos_itens' })
export class PedidoItemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  pedidoId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  produtoId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  sequencia: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  solicitado: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  atendido: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  valorUnitario: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  valorUnitDesconto: number;

  @ApiProperty()
  @Column('int')
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
