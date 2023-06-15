import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn, ViewEntity } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@ViewEntity({ name: 'view_romaneios' })
export class RomaneioView extends BaseEntity {
  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  empresaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  romaneioId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => value.toISOString().substring(0, 10), to: (value) => new Date(value) } })
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
  @ViewColumn({ transformer: { from: (value) => Boolean(value), to: (value) => Boolean(value) } })
  pago: boolean;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Boolean(value), to: (value) => Boolean(value) } })
  acertoConsignacao: boolean;

  @ApiProperty()
  @ViewColumn()
  tipoFrete: string;

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

  constructor(partial?: Partial<RomaneioView>) {
    super();
    Object.assign(this, partial);
  }
}
