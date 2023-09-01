import { ApiProperty } from '@nestjs/swagger';
import { OneToMany, ViewColumn, ViewEntity } from 'typeorm';

import { BaseView } from 'src/commons/base.view';

import { ConsignacaoItemView } from '../consignacao-item/views/consignacao-item.view';
import { SituacaoConsignacao, SituacaoConsignacaoEnum } from '../enum/situacao-consignacao.enum';

@ViewEntity({ name: 'view_consignacoes' })
export class ConsignacaoView extends BaseView {
  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  empresaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  id: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  pessoaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  nomePessoa: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  tabelaPrecoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  caixaAbertura: number;

  @ApiProperty({ format: 'date' })
  @ViewColumn({ transformer: { from: (value) => new Date(value).format('yyyy-MM-dd'), to: (value) => value } })
  dataAbertura: Date;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => new Date(value).format('yyyy-MM-dd'), to: (value) => value } })
  previsaoFechamento: Date;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  caixaFechamento: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => new Date(value).format('yyyy-MM-dd'), to: (value) => value } })
  dataFechamento: Date;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  funcionarioId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  nomeFuncionario: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  observacao: string;

  @ApiProperty({ enum: SituacaoConsignacaoEnum })
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  situacao: SituacaoConsignacao;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  motivoCancelamento: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  solicitado: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorSolicitado: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  devolvido: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorDevolvido: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  acertado: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorAcertado: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  pendente: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorPendente: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  operadorId: number;

  @ApiProperty()
  @OneToMany(() => ConsignacaoItemView, (consignacaoItem) => consignacaoItem.consignacao)
  itens: ConsignacaoItemView[];

  constructor(partial?: Partial<ConsignacaoView>) {
    super();
    Object.assign(this, partial);
  }
}
