import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { TipoMovimento } from 'src/commons/enum/tipo-movimento';

import { TipoDocumento } from '../enum/tipo-documento.enum';

@Entity({ name: 'pessoas_extrato' })
export class PessoaExtratoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @Column('date')
  data: Date;

  @ApiProperty()
  @PrimaryColumn('bigint')
  liquidacao: number;

  @ApiProperty()
  @PrimaryColumn('int')
  pessoaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  faturaId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  faturaParcela: number;

  @ApiProperty({ enum: TipoDocumento })
  @Column('enum', { enum: TipoDocumento })
  tipoDocumento: TipoDocumento;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  @Transform(({ value }) => parseFloat(value))
  valor: number;

  @ApiProperty({ enum: TipoMovimento })
  @Column('enum', { enum: TipoMovimento })
  tipoMovimento: TipoMovimento;

  @ApiProperty()
  @Column('varchar', { length: 45 })
  descricao: string;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  observacao: string;

  @ApiProperty()
  @Column('boolean', { default: false })
  cancelado: boolean;

  @ApiProperty()
  @Column('varchar', { length: 500 })
  motivoCancelamento: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  constructor(partial?: Partial<PessoaExtratoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
