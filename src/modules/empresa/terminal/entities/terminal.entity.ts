import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'empresas_terminais' })
export class TerminalEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({ primary: true })
  empresaId: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  inativo: boolean;

  constructor(partial?: Partial<TerminalEntity>) {
    super();
    Object.assign(this, partial);
  }
}
