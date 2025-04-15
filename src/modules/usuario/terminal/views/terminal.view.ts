import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { UsuarioEntity } from '../../entities/usuario.entity';

@Entity({ name: 'view_usuarios_terminais' })
export class UsuarioTerminalView extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn()
  usuarioId: number;

  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  inativo: boolean;

  @Exclude()
  @ManyToOne(() => UsuarioEntity, (value) => value.terminais)
  @JoinColumn({ name: 'usuarioId', referencedColumnName: 'id' })
  usuario: UsuarioEntity;

  constructor(partial?: Partial<UsuarioTerminalView>) {
    super();
    Object.assign(this, partial);
  }
}
