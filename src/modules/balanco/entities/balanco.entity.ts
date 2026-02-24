import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { SituacaoBalanco } from '../enum/situacao-balanco.enum';

@Entity({ name: 'balancos' })
export class BalancoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty()
  @Column('int')
  empresaId: number;

  @ApiProperty()
  @Column('date')
  data: Date;

  @ApiProperty({ required: false })
  @Column('text')
  observacao?: string;

  @ApiProperty({ enum: SituacaoBalanco })
  @Column('varchar')
  situacao: SituacaoBalanco;

  @ApiProperty({ required: false })
  @Column('varchar')
  motivoCancelamento?: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  constructor(partial?: Partial<BalancoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
