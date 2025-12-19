import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { PessoaEntity } from '../../entities/pessoa.entity';
import { TransacaoTipo, TransacaoTipoEnum } from '../enum/transacao-tipo.enum';

@Entity('pessoas_transacoes_pontos')
export class TransacaoPontoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  pessoaId: number;

  @ApiProperty()
  @PrimaryColumn('varchar')
  pessoaDocumento: string;

  @ApiProperty({ enum: TransacaoTipoEnum })
  @Column('varchar')
  tipo: TransacaoTipo;

  @ApiProperty()
  @Column('decimal')
  quantidade: number;

  @ApiProperty()
  @Column('decimal')
  resgatado: number;

  @ApiProperty({ description: 'ID da transação que originou os pontos resgatados, apenas para transações do tipo Débito' })
  @Column('int')
  transacaoId: number;

  @ApiProperty()
  @Column('timestamp')
  data: Date;

  @ApiProperty()
  @Column('varchar')
  observacao: string;

  @ApiProperty()
  @Column('timestamp')
  validaAte: Date;

  @ApiProperty()
  @Column('boolean')
  cancelada: boolean;

  @ApiProperty()
  @Column('varchar')
  motivoCancelamento: string;

  @ApiProperty()
  @Column('timestamp')
  canceladaEm: Date;

  @Exclude()
  @ManyToOne(() => PessoaEntity, (pessoa) => pessoa.transacaoPontos)
  @JoinColumn({ name: 'pessoaId', referencedColumnName: 'id' })
  pessoa: PessoaEntity;

  constructor(partial?: Partial<TransacaoPontoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
