import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { TipoPedido, TipoPedidoType } from '../enum/tipo-pedido.enum';
import { SituacaoPedido, SituacaoPedidoType } from '../enum/situacao-pedido.enum';
import { PedidoItemEntity } from '../pedido-item/entities/pedido-item.entity';

@Entity({ name: 'pedidos' })
export class PedidoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty()
  @Column('bigint')
  pessoaId: number;

  @ApiProperty()
  @Column('int')
  funcionarioId: number;

  @ApiProperty()
  @Column('int')
  tabelaPrecoId: number;

  @ApiProperty({ format: 'date' })
  @Column('date')
  dataBasePagamento: Date;

  @ApiProperty()
  @Column('int')
  parcelas: number;

  @ApiProperty()
  @Column('int')
  intervalo: number;

  @ApiProperty({ format: 'date' })
  @Column('date')
  previsaoDeFaturamento: Date;

  @ApiProperty({ format: 'date' })
  @Column('date')
  previsaoDeEntrega: Date;

  @ApiProperty({ enum: TipoPedido })
  @Column('varchar')
  tipo: TipoPedidoType | TipoPedido;

  @ApiProperty()
  @Column('boolean')
  kardex: boolean;

  @ApiProperty()
  @Column('boolean')
  financeiro: boolean;

  @ApiProperty()
  @Column('boolean')
  fiscal: boolean;

  @ApiProperty()
  @Column('varchar')
  observacao: string;

  @ApiProperty({ enum: SituacaoPedido })
  @Column('varchar')
  situacao: SituacaoPedidoType | SituacaoPedido;

  @ApiProperty()
  @Column('bigint')
  romaneioOrigemId: number;

  @ApiProperty()
  @Column('bigint')
  romaneioDestinoId: number;

  @ApiProperty()
  @Column('bigint')
  pedidoExternoId: number;

  @ApiProperty()
  @Column('varchar')
  motivoCancelamento: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @ApiProperty()
  @OneToMany(() => PedidoItemEntity, (pedidoItem) => pedidoItem.pedido)
  itens: PedidoItemEntity[];

  constructor(partial?: Partial<PedidoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
