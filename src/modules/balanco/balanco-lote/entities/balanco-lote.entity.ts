import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { SituacaoBalancoLote } from '../enum/situacao-balanco-lote.enum';

@Entity({ name: 'balancos_lotes' })
export class BalancoLoteEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty()
  @Column('int')
  empresaId: number;

  @ApiProperty()
  @Column('bigint')
  balancoId: number;

  @ApiProperty()
  @Column('varchar')
  lote: string;

  @ApiProperty({ required: false })
  @Column('text')
  observacao?: string;

  @ApiProperty({ enum: SituacaoBalancoLote })
  @Column('varchar')
  situacao: SituacaoBalancoLote;

  @ApiProperty({ required: false })
  @Column('varchar')
  motivoCancelamento?: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  constructor(partial?: Partial<BalancoLoteEntity>) {
    super();
    Object.assign(this, partial);
  }
}
