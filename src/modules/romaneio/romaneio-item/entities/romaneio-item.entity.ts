import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'romaneios_itens' })
export class RomaneioItemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn()
  romaneioId: number;

  @ApiProperty()
  @PrimaryColumn()
  data: Date;

  @ApiProperty()
  @PrimaryColumn()
  referenciaId: number;

  @ApiProperty()
  @PrimaryColumn()
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
  @Column()
  emPromocao: boolean;

  @ApiProperty()
  @Column()
  cupomId: number;

  @ApiProperty()
  @Column()
  operadorId: number;
}
