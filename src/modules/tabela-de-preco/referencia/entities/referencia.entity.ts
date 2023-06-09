import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'tabelas_de_precos_referencias' })
export class PrecoReferencia extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  tabelaDePrecoId: number;

  @ApiProperty()
  @PrimaryColumn()
  referenciaId: number;

  @ApiProperty()
  @Column('decimal')
  preco: number;

  @ApiProperty()
  @Column()
  operadorId: number;

  constructor(partial?: Partial<PrecoReferencia>) {
    super();
    Object.assign(this, partial);
  }
}
