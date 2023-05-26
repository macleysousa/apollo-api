import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { PessoaTipo } from '../enum/pessoa-tipo.enum';
import { Transform } from 'class-transformer';

@Entity({ name: 'pessoas' })
export class PessoaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty({ enum: PessoaTipo })
  @Column()
  tipo: PessoaTipo;

  @ApiProperty()
  @Column()
  documento: string;

  @ApiProperty()
  @Column()
  ufInscricaoEstadual: string;

  @ApiProperty()
  @Column()
  inscricaoEstadual: string;

  @ApiProperty({ type: 'string', format: 'date' })
  @Column()
  nascimento: Date;

  @ApiProperty({ default: true })
  @Column()
  cliente: boolean;

  @ApiProperty()
  @Column()
  fornecedor: boolean;

  @ApiProperty()
  @Column()
  funcionario: boolean;

  @ApiProperty({ default: false })
  @Column()
  bloqueado: boolean;

  @ApiProperty()
  @Column()
  empresaCadastro: number;

  @ApiProperty({ type: [Number] })
  @Column('simple-array')
  @Transform(({ value }) => value.map(Number))
  empresasAcesso: number[];

  constructor(partial?: Partial<PessoaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
