import { ApiProperty } from '@nestjs/swagger';
import { JoinColumn, OneToMany, ViewColumn, ViewEntity } from 'typeorm';

import { BaseView } from 'src/commons/base.view';
import { TipoFrete } from 'src/commons/enum/tipo-frete';

import { ModalidadeRomaneio, ModalidadeRomaneioType } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio, OperacaoRomaneioType } from '../enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { RomaneioItemView } from '../romaneio-item/views/romaneio-item.view';

@ViewEntity({ name: 'view_romaneios' })
export class RomaneioView extends BaseView {
  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  empresaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  romaneioId: number;

  @ApiProperty({ format: 'date' })
  @ViewColumn({ transformer: { from: (value) => new Date(value).format('yyyy-MM-dd'), to: (value) => value } })
  data: Date;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  pessoaId: number;

  @ApiProperty()
  @ViewColumn()
  pessoaNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  funcionarioId: number;

  @ApiProperty()
  @ViewColumn()
  funcionarioNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  tabelaPrecoId: number;

  @ApiProperty({ enum: ModalidadeRomaneio })
  @ViewColumn()
  modalidade: ModalidadeRomaneioType | ModalidadeRomaneio;

  @ApiProperty({ enum: OperacaoRomaneio })
  @ViewColumn()
  operacao: OperacaoRomaneioType | OperacaoRomaneio;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => JSON.parse(value ?? '[]'), to: (value) => JSON.parse(value) } })
  romaneiosDevolucao: number[];

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => JSON.parse(value ?? '[]'), to: (value) => JSON.parse(value) } })
  romaneiosConsignacao: number[];

  @ApiProperty({ enum: SituacaoRomaneio })
  @ViewColumn()
  situacao: SituacaoRomaneio;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Boolean(value), to: (value) => value } })
  pago: boolean;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  consignacaoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  caixaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  liquidacao: number;

  @ApiProperty({ enum: TipoFrete })
  @ViewColumn()
  tipoFrete: TipoFrete;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorFrete: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  quantidade: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorBruto: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorDesconto: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valorLiquido: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  operadorId: number;

  @ApiProperty()
  @OneToMany(() => RomaneioItemView, ({ romaneio }) => romaneio)
  @JoinColumn({ name: 'romaneioId', referencedColumnName: 'romaneioId' })
  itens: RomaneioItemView[];

  constructor(partial?: Partial<RomaneioView>) {
    super();
    Object.assign(this, partial);
  }
}
