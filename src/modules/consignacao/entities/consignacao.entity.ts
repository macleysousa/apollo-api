import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { ConsignacaoItemEntity } from '../consignacao-item/entities/consignacao-item.entity';
import { SituacaoConsignacao, SituacaoConsignacaoEnum } from '../enum/situacao-consignacao.enum';

@Entity({ name: 'consignacoes' })
export class ConsignacaoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  pessoaId: number;

  @ApiProperty()
  @Column('int')
  funcionarioId: number;

  @ApiProperty()
  @Column('int')
  tabelaPrecoId: number;

  @ApiProperty()
  @Column('bigint')
  caixaAbertura: number;

  @ApiProperty({ format: 'date' })
  @Column('date')
  dataAbertura: Date;

  @ApiProperty({ format: 'date' })
  @Column('date')
  previsaoFechamento: Date;

  @ApiProperty()
  @Column('bigint')
  caixaFechamento: number;

  @ApiProperty({ format: 'date' })
  @Column('date')
  dataFechamento: Date;

  @ApiProperty({ enum: SituacaoConsignacaoEnum })
  @Column('varchar')
  situacao: SituacaoConsignacao | SituacaoConsignacaoEnum;

  @ApiProperty()
  @Column('varchar')
  motivoCancelamento: string;

  @ApiProperty()
  @Column('varchar')
  observacao: string;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @ApiProperty()
  @OneToMany(() => ConsignacaoItemEntity, (consignacaoItem) => consignacaoItem.consignacao)
  itens: ConsignacaoItemEntity[];

  constructor(partial?: Partial<ConsignacaoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
