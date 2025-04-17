import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { ContatoTipo } from '../enum/contato-tipo.enum';
import { PessoaTipo } from '../enum/pessoa-tipo.enum';
import { TransacaoPontoEntity } from '../transacao-ponto/entities/transacao-ponto.entity';

@Entity({ name: 'pessoas' })
export class PessoaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  nome: string;

  @ApiProperty({ enum: PessoaTipo })
  @Column({ nullable: false })
  tipo: PessoaTipo;

  @ApiProperty()
  @Column({ nullable: true })
  documento: string;

  @ApiProperty()
  @Column({ nullable: true })
  ufInscricaoEstadual: string;

  @ApiProperty()
  @Column({ nullable: true })
  inscricaoEstadual: string;

  @ApiProperty({ type: 'string', format: 'date' })
  @Column({ nullable: true })
  nascimento: Date;

  @ApiProperty()
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ enum: ContatoTipo })
  @Column({ nullable: true })
  tipoContato: ContatoTipo;

  @ApiProperty()
  @Column({ nullable: true })
  contato: string;

  @ApiProperty({ default: true })
  @Column({ nullable: true })
  cliente: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  fornecedor: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  funcionario: boolean;

  @ApiProperty({ default: false })
  @Column({ nullable: true })
  bloqueado: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  empresaCadastro: number;

  @ApiProperty({ type: [Number] })
  @Column('simple-array')
  @Transform(({ value }) => value.map(Number))
  empresasAcesso: number[];

  @ApiProperty({ type: () => TransacaoPontoEntity, isArray: true })
  @OneToMany(() => TransacaoPontoEntity, (value) => value.pessoa)
  transacaoPontos: TransacaoPontoEntity[];

  constructor(partial?: Partial<PessoaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
