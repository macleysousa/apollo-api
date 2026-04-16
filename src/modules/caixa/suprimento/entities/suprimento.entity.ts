import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'caixas_suprimento' })
export class CaixaSuprimentoEntity extends BaseEntity {
  @ApiProperty({ description: 'Identificador do suprimento' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'ID da empresa' })
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty({ description: 'Data do registro do suprimento (data corrente da empresa)' })
  @PrimaryColumn('date')
  data: Date;

  @ApiProperty({ description: 'ID do caixa' })
  @PrimaryColumn('bigint')
  caixaId: number;

  @ApiProperty({ description: 'Valor do suprimento (em unidade monetária, com até 4 casas decimais)' })
  @Column('decimal', { precision: 10, scale: 4, transformer: { from: (v) => parseFloat(v), to: (v) => v } })
  valor: number;

  @ApiProperty({ description: "Origem do suprimento (ex.: 'externa')" })
  @Column('varchar', { length: 45, default: 'externa' })
  origem: string;

  @ApiProperty({ description: 'Descrição ou observação do suprimento', required: false })
  @Column('varchar', { length: 500, nullable: true })
  descricao: string;

  @ApiProperty({ description: 'ID da liquidação do extrato vinculada a este suprimento', required: false })
  @Column('bigint', { nullable: true })
  liquidacao: number;

  @ApiProperty({ description: 'ID do operador que registrou o suprimento' })
  @Column('int')
  operadorId: number;

  @ApiProperty({ description: 'Indica se o suprimento foi cancelado', required: false })
  @Column('boolean', { default: false })
  cancelado: boolean;

  @ApiProperty({ description: 'Motivo do cancelamento do suprimento (quando aplicável)', required: false })
  @Column('varchar', { length: 255, nullable: true })
  motivoCancelamento: string;

  @ApiProperty({ description: 'ID do operador que efetuou o cancelamento (quando aplicável)', required: false })
  @Column('int', { nullable: true })
  operadorCancelamentoId: number;

  @ApiProperty({ description: 'Data e hora do cancelamento do suprimento (quando aplicável)', required: false })
  @Column('timestamp', { nullable: true })
  canceladoEm: Date;

  constructor(partial?: Partial<CaixaSuprimentoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
