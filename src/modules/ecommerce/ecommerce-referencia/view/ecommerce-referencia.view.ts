import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';

@ViewEntity({ name: 'view_ecommerce_referencias' })
export class EcommerceReferenciaView extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('bigint', { transformer: { to: (value) => value, from: (value) => parseInt(value) } })
  id: number;

  @ApiProperty()
  @Column('int')
  empresaId: number;

  @ApiProperty()
  @Column('int')
  referenciaId: number;

  @ApiProperty()
  @Column('varchar')
  nome: string;

  @ApiProperty()
  @Column('varchar')
  idExterno: string;

  @ApiProperty({ enum: UnidadeMedida })
  @Column('varchar')
  unidadeMedida: UnidadeMedida;

  @ApiProperty()
  @Column('int')
  categoriaId: number;

  @ApiProperty()
  @Column('int')
  subCategoriaId: number;

  @ApiProperty()
  @Column('int')
  marcaId: number;

  @ApiProperty()
  @Column('text')
  descricao: string;

  @ApiProperty()
  @Column('text')
  composicao: string;

  @ApiProperty()
  @Column('text')
  cuidados: string;

  @ApiProperty()
  @Column('int')
  tabelaDePrecoId: number;

  @ApiProperty()
  @ViewColumn({ transformer: { from: (value) => parseFloat(value), to: (value) => parseFloat(value) } })
  valor: number;

  @ApiProperty()
  @Column('varchar')
  media_tipo: string;

  @ApiProperty()
  @Column('varchar')
  media_url: string;

  @ApiProperty()
  @Column('boolean')
  rascunho: boolean;
}
