import { ApiProperty } from '@nestjs/swagger';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'view_empresas_parametros' })
export class EmpresaParametroView {
  @ApiProperty()
  @ViewColumn()
  empresaId: number;

  @ApiProperty()
  @ViewColumn()
  parametroId: string;

  @ApiProperty()
  @ViewColumn()
  descricao: string;

  @ApiProperty()
  @ViewColumn()
  valor: string;

  @ApiProperty()
  @ViewColumn()
  depreciado: boolean;
}
