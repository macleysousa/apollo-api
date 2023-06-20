import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { TipoDocumento } from 'src/commons/enum/tipo-documento';

@Entity({ name: 'formas_de_pagamento' })
export class FormaDePagamentoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  descricao: string;

  @ApiProperty()
  @Column('int')
  inicio: number;

  @ApiProperty()
  @Column('int')
  parcelas: number;

  @ApiProperty({ enum: TipoDocumento })
  @Column('varchar')
  tipo: TipoDocumento;

  @ApiProperty()
  @Column()
  inativa: boolean;

  constructor(partial?: Partial<FormaDePagamentoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
