import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

import { FormaDePagamentoEntity } from 'src/modules/forma-de-pagamento/entities/forma-de-pagamento.entity';

import { EmpresaEntity } from '../../entities/empresa.entity';

@Entity({ name: 'empresas_formas_de_pagamento' })
export class EmpresaFormaPagamentoEntity {
  @ApiProperty()
  @PrimaryColumn()
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn()
  formaPagamentoId: number;

  @ApiProperty()
  @OneToOne(() => FormaDePagamentoEntity, ({ id }) => id, { eager: true })
  @JoinColumn({ name: 'formaPagamentoId' })
  formaDePagamento: FormaDePagamentoEntity;

  @Exclude()
  @ManyToOne(() => EmpresaEntity, ({ formasDePagamento }) => formasDePagamento)
  empresa: EmpresaEntity;

  constructor(partial?: Partial<EmpresaFormaPagamentoEntity>) {
    Object.assign(this, partial);
  }
}
