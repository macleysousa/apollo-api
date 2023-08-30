import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'consignacoes_itens' })
export class ConsignacaoItemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  consignacaoId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  romaneioId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  sequencia: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  produtoId: number;

  @ApiProperty()
  @Column('decimal', { precision: 18, scale: 4 })
  quantidade: number;

  @ApiProperty()
  @Column('decimal', { precision: 18, scale: 4 })
  devolvido: number;

  @ApiProperty()
  @Column('decimal', { precision: 18, scale: 4 })
  acertado: number;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  constructor(partial: Partial<ConsignacaoItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
