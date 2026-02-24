import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'balancos_itens' })
export class BalancoItemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  balancoId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  sequencia: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  produtoId: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  quantidadeOriginal: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  quantidadeContada: number;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  constructor(partial?: Partial<BalancoItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
