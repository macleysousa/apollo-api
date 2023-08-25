import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'romaneios_itens' })
export class RomaneioItemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  romaneioId: number;

  @ApiProperty()
  @PrimaryColumn('date')
  data: Date;

  @ApiProperty()
  @PrimaryColumn('int')
  sequencia: number;

  @ApiProperty()
  @PrimaryColumn('int')
  referenciaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  produtoId: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  quantidade: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  valorUnitario: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  valorUnitDesconto: number;

  @ApiProperty()
  @Column('boolean')
  emPromocao: boolean;

  @ApiProperty()
  @Column('int')
  cupomId: number;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  devolvido: number;

  @ApiProperty()
  @Column('bigint')
  romaneioOrigemId: number;

  @ApiProperty()
  @Column('int')
  romaneioOrigemSequencia: number;

  @ApiProperty()
  @Column('int')
  operadorId: number;
}
