import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn, ViewEntity } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@ViewEntity({ name: 'view_precos_referencias' })
export class PrecoReferenciaView extends BaseEntity {
  @ApiProperty()
  @ViewColumn()
  tabelaDePrecoId: number;

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
  @ViewColumn({ transformer: { from: (value) => parseFloat(value), to: (value) => parseFloat(value) } })
  valor: number;

  @ApiProperty()
  @ViewColumn()
  operadorId: number;

  constructor(partial?: Partial<PrecoReferenciaView>) {
    super();
    Object.assign(this, partial);
  }
}
