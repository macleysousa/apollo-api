import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'usuarios_acessos' })
export class UsuarioAcessoEntity {
  @ApiProperty()
  @ViewColumn()
  id: number;

  @ApiProperty()
  @ViewColumn()
  empresaId: number;

  @ApiProperty()
  @ViewColumn()
  grupoId: number;

  @ApiProperty()
  @ViewColumn()
  grupoNome: string;

  @ApiProperty()
  @ViewColumn()
  componenteId: string;

  @ApiProperty()
  @ViewColumn()
  componenteNome: string;

  @ApiProperty()
  @ViewColumn()
  descontinuado: boolean;

  constructor(partial?: Partial<UsuarioAcessoEntity>) {
    Object.assign(this, partial);
  }
}
