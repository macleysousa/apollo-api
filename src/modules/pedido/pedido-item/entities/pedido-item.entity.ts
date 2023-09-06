import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

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

  constructor(partial?: Partial<PedidoItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
