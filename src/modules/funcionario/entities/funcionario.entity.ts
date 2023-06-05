import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { FuncionarioTipo } from '../enum/funcionario-tipo.enum';

@Entity({ name: 'funcionarios' })
export class FuncionarioEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn({ nullable: false })
  empresaId: number;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  nome: string;

  @ApiProperty()
  @Column({ nullable: true })
  pessoaId: number;

  @ApiProperty({ enum: FuncionarioTipo })
  @Column({ nullable: false })
  tipo: FuncionarioTipo;

  @ApiProperty({ default: false })
  @Column({ default: false })
  inativo: boolean;

  constructor(partial?: Partial<FuncionarioEntity>) {
    super();
    Object.assign(this, partial);
  }
}
