import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CaixaSituacao } from '../enum/caixa-situacao.enum';

@Entity({ name: 'caixas' })
export class CaixaEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  empresaId: number;

  @ApiProperty()
  @Column({ nullable: false })
  terminalId: number;

  @ApiProperty()
  @Column({ nullable: true })
  abertura: Date;

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
  valorAbertura: number;

  @ApiProperty()
  @Column({ nullable: true })
  operadorAberturaId: number;

  @ApiProperty()
  @Column({ nullable: true })
  fechamento: Date;

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true, precision: 10, scale: 2 })
  valorFechamento: number;

  @ApiProperty()
  @Column({ nullable: true })
  operadorFechamentoId: number;

  @ApiProperty({ enum: CaixaSituacao, default: CaixaSituacao.Aberto })
  @Column({ type: 'varchar', nullable: true, default: CaixaSituacao.Aberto })
  situacao: CaixaSituacao;

  constructor(partial?: Partial<CaixaEntity>) {
    Object.assign(this, partial);
  }
}
