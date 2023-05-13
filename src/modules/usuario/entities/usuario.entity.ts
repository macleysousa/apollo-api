import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/commons/base.entity';
import { decrypt, encrypt } from 'src/commons/crypto';

import { Role } from '../enums/usuario-tipo.enum';
import { UsuarioSituacao } from '../enums/usuario-situacao.enum';

@Entity({ name: 'usuarios' })
export class UsuarioEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  usuario: string;

  @Exclude()
  @Column({
    transformer: {
      to: (value) => {
        return encrypt(value);
      },
      from: (value) => {
        return decrypt(value);
      },
    },
  })
  senha: string;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column({ default: UsuarioSituacao.ativo })
  situacao: UsuarioSituacao;

  @ApiProperty({ enum: Role })
  @Column()
  tipo: Role;

  constructor(partial?: Partial<UsuarioEntity>) {
    super();
    Object.assign(this, partial);
  }
}
