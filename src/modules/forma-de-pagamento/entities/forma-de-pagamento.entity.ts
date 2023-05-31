import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { PagamentoTipo } from '../enum/pagamento-tipo.enum';

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

  @ApiProperty({ enum: PagamentoTipo })
  @Column('varchar')
  tipo: PagamentoTipo;

  @ApiProperty()
  @Column()
  inativa: boolean;
}
