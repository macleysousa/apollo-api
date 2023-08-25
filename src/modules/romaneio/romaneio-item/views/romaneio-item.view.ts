import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';

import { BaseView } from 'src/commons/base.view';

import { RomaneioView } from '../../views/romaneio.view';

@ViewEntity({ name: 'view_romaneios_itens' })
export class RomaneioItemView extends BaseView {
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
  sequencia: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  referenciaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  referenciaIdExterno: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  referenciaNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  produtoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  produtoIdExterno: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  corId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  corNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  tamanhoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  tamanhoNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  modalidade: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  operacao: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => String(value) } })
  situacao: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Boolean(value), to: (value) => Boolean(value) } })
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
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  cupomId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  operadorId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  devolvido: number;

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
