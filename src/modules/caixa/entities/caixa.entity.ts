import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { CaixaSituacao } from '../enum/caixa-situacao.enum';

@Entity({ name: 'caixas' })
export class CaixaEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('date')
  data: Date;

  @ApiProperty()
  @PrimaryColumn('int')
  terminalId: number;

  @ApiProperty()
  @Column('timestamp')
  abertura: Date;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 4 })
  valorAbertura: number;

  @ApiProperty()
  @Column('int')
  operadorAberturaId: number;

  @ApiProperty()
  @Column('timestamp', { nullable: true })
  fechamento: Date;

  @ApiProperty()
  @Column('decimal', { nullable: true, precision: 10, scale: 4 })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  valorFechamento: number;

  @ApiProperty()
  @Column('int', { nullable: true })
  operadorFechamentoId: number;

  @ApiProperty({ enum: CaixaSituacao, default: CaixaSituacao.aberto })
  @Column('varchar', { nullable: true, default: CaixaSituacao.aberto })
  situacao: CaixaSituacao;

  constructor(partial?: Partial<CaixaEntity>) {
    Object.assign(this, partial);
  }
}
