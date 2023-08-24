import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Parametro } from '../enum/parametros';

@Entity({ name: 'parametros' })
export class ParametroEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: Parametro;

  @ApiProperty()
  @Column()
  descricao: string;

  @ApiProperty()
  @Column()
  valorPadrao: string;

  @ApiProperty()
  @Column({ default: false })
  depreciado?: boolean;

  constructor(partial?: Partial<ParametroEntity>) {
    Object.assign(this, partial);
  }
}
