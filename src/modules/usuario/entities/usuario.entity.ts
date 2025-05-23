import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { decrypt, encrypt } from 'src/commons/crypto';
import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

import { UsuarioSituacao } from '../enums/usuario-situacao.enum';
import { Role } from '../enums/usuario-tipo.enum';
import { UsuarioTerminalEntity } from '../terminal/entities/terminal.entity';
import { UsuarioTerminalView } from '../terminal/views/terminal.view';

@Entity({ name: 'usuarios' })
export class UsuarioEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  usuario: string;

  @Exclude()
  @Column({ transformer: { to: (value) => encrypt(value), from: (value) => decrypt(value) } })
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

  @ApiProperty({ type: () => UsuarioTerminalView, isArray: true })
  @OneToMany(() => UsuarioTerminalView, (value) => value.usuario)
  terminais: UsuarioTerminalView[];

  constructor(partial?: Partial<UsuarioEntity>) {
    super();
    Object.assign(this, partial);
  }
}
