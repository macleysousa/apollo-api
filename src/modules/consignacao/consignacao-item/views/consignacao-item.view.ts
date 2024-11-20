import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, OneToMany, ViewColumn, ViewEntity } from 'typeorm';

import { BaseView } from 'src/commons/base.view';

import { ConsignacaoView } from '../../views/consignacao.view';

@ViewEntity({ name: 'view_consignacoes_itens' })
export class ConsignacaoItemView extends BaseView {
  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  empresaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  consignacaoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  pessoaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  romaneioId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  sequencia: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  produtoId: number;

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

  @Exclude()
  @ManyToOne(() => ConsignacaoView, (consignacaoItem) => consignacaoItem.id)
  @JoinColumn({ name: 'consignacaoId', referencedColumnName: 'id' })
  consignacao: ConsignacaoView;

  constructor(partial?: Partial<ConsignacaoItemView>) {
    super();
    Object.assign(this, partial);
  }
}
