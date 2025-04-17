import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

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
  pessoaDocumento: number;

  @ApiProperty({ enum: TransacaoTipoEnum })
  @Column('varchar')
  tipo: TransacaoTipo;

  @ApiProperty()
  @Column('decimal')
  quantidade: number;

  @ApiProperty()
  @Column('decimal')
  resgatado: number;

  @ApiProperty()
  @Column('timestamp')
  data: Date;

  @ApiProperty()
  @Column('varchar')
  observacao: string;

  @ApiProperty()
  @Column('timestamp')
  validoAte: Date;

  @ApiProperty()
  @Column('boolean')
  cancelado: boolean;

  @ApiProperty()
  @Column('varchar')
  motivoCancelamento: string;

  @ApiProperty()
  @Column('timestamp')
  canceladoEm: Date;

  constructor(partial?: Partial<TransacaoPontoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
