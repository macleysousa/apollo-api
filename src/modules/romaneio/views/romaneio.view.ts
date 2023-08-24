import { ApiProperty } from '@nestjs/swagger';
import { JoinColumn, OneToMany, ViewColumn, ViewEntity } from 'typeorm';

import { BaseView } from 'src/commons/base.view';
import { TipoFrete } from 'src/commons/enum/tipo-frete';

import { ModalidadeRomaneio } from '../enum/modalidade-romaneio.enum';
import { OperacaoRomaneio } from '../enum/operacao-romaneio.enum';
import { SituacaoRomaneio } from '../enum/situacao-romaneio.enum';
import { RomaneioItemView } from '../romaneio-item/views/romaneio-item.view';

@ViewEntity({ name: 'view_romaneios' })
export class RomaneioView extends BaseView {
  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  empresaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  romaneioId: number;

  @ApiProperty({ format: 'date' })
  @ViewColumn({ transformer: { from: (value) => new Date(value).format('yyyy-MM-dd'), to: (value) => new Date(value) } })
  data: Date;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  pessoaId: number;

  @ApiProperty()
  @ViewColumn()
  pessoaNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  funcionarioId: number;

  @ApiProperty()
  @ViewColumn()
  funcionarioNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  tabelaPrecoId: number;

  @ApiProperty({ enum: ModalidadeRomaneio })
  @ViewColumn()
  modalidade: ModalidadeRomaneio;

  @ApiProperty({ enum: OperacaoRomaneio })
  @ViewColumn()
  operacao: OperacaoRomaneio;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => JSON.parse(value), to: (value) => JSON.parse(value) } })
  romaneiosDevolucao: number[];

  @ApiProperty({ enum: SituacaoRomaneio })
  @ViewColumn()
  situacao: SituacaoRomaneio;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Boolean(value), to: (value) => Boolean(value) } })
  pago: boolean;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Boolean(value), to: (value) => Boolean(value) } })
  acertoConsignacao: boolean;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  caixaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  liquidacao: number;

  @ApiProperty({ enum: TipoFrete })
  @ViewColumn()
  tipoFrete: TipoFrete;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorFrete: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  quantidade: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorBruto: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorDesconto: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorLiquido: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
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
