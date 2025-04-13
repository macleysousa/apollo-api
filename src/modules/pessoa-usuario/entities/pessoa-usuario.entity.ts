import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { getR2Url } from 'src/helpers/r2';

@Entity({ name: 'pessoas' })
export class PessoaUsuario extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('varchar')
  nome: string;

  @ApiProperty()
  @Column('varchar')
  email: string;

  @ApiProperty()
  @Column('varchar')
  documento: string;

  @ApiProperty()
  @Column('date')
  dataNascimento: Date;

  @ApiProperty()
  @Column('varchar', { transformer: { to: (value) => getR2Url(value), from: (value) => value } })
  imagemPerfil: string;

  @ApiProperty()
  @Column('boolean')
  emailVerificado: boolean;
}
