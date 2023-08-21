import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';

import { BaseView } from 'src/commons/base.view';

import { RomaneioView } from '../../views/romaneio.view';

@ViewEntity({ name: 'view_romaneios_itens' })
export class RomaneioItemView extends BaseView {
  @ApiProperty()
  @ViewColumn()
  empresaId: number;

  @ApiProperty()
  @ViewColumn()
  romaneioId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => value.toISOString().substring(0, 10), to: (value) => new Date(value) } })
  data: Date;

  @ApiProperty()
  @ViewColumn()
  sequencia: number;

  @ApiProperty()
  @ViewColumn()
  referenciaId: number;

  @ApiProperty()
  @ViewColumn()
  referenciaIdExterno: string;

  @ApiProperty()
  @ViewColumn()
  referenciaNome: string;

  @ApiProperty()
  @ViewColumn()
  produtoId: number;

  @ApiProperty()
  @ViewColumn()
  produtoIdExterno: string;

  @ApiProperty()
  @ViewColumn()
  corId: number;

  @ApiProperty()
  @ViewColumn()
  corNome: string;

  @ApiProperty()
  @ViewColumn()
  tamanhoId: number;

  @ApiProperty()
  @ViewColumn()
  tamanhoNome: string;

  @ApiProperty()
  @ViewColumn()
  modalidade: string;

  @ApiProperty()
  @ViewColumn()
  operacao: string;

  @ApiProperty()
  @ViewColumn()
  situacao: string;

  @ApiProperty()
  @ViewColumn()
  emPromocao: boolean;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  quantidade: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorUnitario: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorUnitDesconto: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorTotalBruto: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorTotalDesconto: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  valorTotalLiquido: number;

  @ApiProperty()
  @ViewColumn()
  cupomId: number;

  @ApiProperty()
  @ViewColumn()
  operadorId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Boolean(value), to: (value) => Boolean(value) } })
  devolvido: boolean;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  romaneioDevolucaoId: number;

  @Exclude()
  @ManyToOne(() => RomaneioView, (romaneio) => romaneio.itens)
  @JoinColumn({ name: 'romaneioId', referencedColumnName: 'romaneioId' })
  romaneio: RomaneioView;

  constructor(partial?: Partial<RomaneioItemView>) {
    super();
    Object.assign(this, partial);
  }
}
