import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { Exclude } from 'class-transformer';
import { EmpresaEntity } from '../../entities/empresa.entity';

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

  @Exclude()
  @ManyToOne(() => EmpresaEntity, ({ terminais }) => terminais)
  empresa: EmpresaEntity;

  constructor(partial?: Partial<TerminalEntity>) {
    super();
    Object.assign(this, partial);
  }
}
