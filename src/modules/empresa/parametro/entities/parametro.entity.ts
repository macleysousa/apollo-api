import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'empresas_parametros', orderBy: { empresaId: 'ASC', parametroId: 'ASC' } })
export class EmpresaParametroEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn()
  parametroId: string;

  @ApiProperty()
  @Column()
  valor: string;

  constructor(partial?: Partial<EmpresaParametroEntity>) {
    super();
    Object.assign(this, partial);
  }
}
