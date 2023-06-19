import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { TipoDocumento } from 'src/commons/enum/tipo-documento';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';

import { TipoHistorico } from '../enum/tipo-historico.enum';

@Entity({ name: 'caixas_extrato' })
export class CaixaExtratoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('date')
  data: Date;

  @ApiProperty()
  @PrimaryColumn('bigint')
  caixaId: number;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  documento: number;

  @ApiProperty({ enum: TipoDocumento })
  @Column('varchar', { length: 45 })
  tipoDocumento: TipoDocumento;

  @ApiProperty({ enum: TipoHistorico })
  @Column('varchar', { length: 45 })
  tipoHistorico: TipoHistorico;

  @ApiProperty({ enum: TipoMovimento })
  @Column('enum', { enum: TipoMovimento })
  tipoMovimento: TipoMovimento;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (value) => parseFloat(value), to: (value) => value } })
  valor: number;

  @ApiProperty()
  @Column('bigint')
  faturaId: number;

  @ApiProperty()
  @Column('bigint')
  faturaParcela: number;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  observacao: string;

  @ApiProperty()
  @Column('boolean')
  cancelado: boolean;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  motivoCancelamento: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  constructor(partial?: Partial<CaixaExtratoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
