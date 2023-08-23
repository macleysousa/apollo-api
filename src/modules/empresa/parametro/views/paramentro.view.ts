import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { EmpresaEntity } from '../../entities/empresa.entity';

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

  @Exclude()
  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.parametros)
  @JoinColumn({ name: 'empresaId', referencedColumnName: 'id' })
  empresa: EmpresaEntity;
}
