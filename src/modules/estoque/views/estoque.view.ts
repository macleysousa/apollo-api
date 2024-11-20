import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'view_estoque_produtos' })
export class EstoqueView {
  @ApiProperty()
  @ViewColumn()
  empresaId: number;

  @ApiProperty()
  @ViewColumn()
  referenciaId: number;

  @ApiProperty()
  @ViewColumn()
  referenciaIdExterno: string;

  @ApiProperty()
  @ViewColumn()
  produtoId: number;

  @ApiProperty()
  @ViewColumn()
  produtoIdExterno: string;

  @ApiProperty()
  @ViewColumn()
  nome: string;

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
  unidadeMedida: string;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => Number(value), to: (value) => Number(value) } })
  saldo: number;

  @ApiProperty()
  @ViewColumn()
  atualizadoEm: Date;

  constructor(partial?: Partial<EstoqueView>) {
    Object.assign(this, partial);
  }
}
