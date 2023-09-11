import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'view_produtos_com_preco' })
export class ProdutoComPrecoView {
  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  produtoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  produtoIdExterno: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  referenciaId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  referenciaIdExterno: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  nome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  corId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  corNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  tamanhoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  tamanhoNome: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => String(value), to: (value) => value } })
  unidadeMedida: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  tabelaDePrecoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => value } })
  valor: number;

  constructor(partial?: Partial<ProdutoComPrecoView>) {
    Object.assign(this, partial);
  }
}
