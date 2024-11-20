import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

import { UsuarioEntity } from '../../entities/usuario.entity';

@Entity({ name: 'usuarios_terminais' })
export class UsuarioTerminalEntity {
  @ApiProperty()
  @PrimaryColumn()
  usuarioId: number;

  @Exclude()
  @PrimaryColumn()
  empresaId: number;

  @Exclude()
  @PrimaryColumn()
  terminalId: number;

  @OneToOne(() => TerminalEntity, { eager: true })
  @JoinColumn({ name: 'empresaId', referencedColumnName: 'id' })
  @JoinColumn({ name: 'terminalId', referencedColumnName: 'id' })
  terminal: TerminalEntity;

  @Exclude()
  @ManyToOne(() => UsuarioEntity, (value) => value.terminais)
  @JoinColumn({ name: 'usuarioId', referencedColumnName: 'id' })
  usuario: UsuarioEntity;

  constructor(partial?: Partial<UsuarioTerminalEntity>) {
    Object.assign(this, partial);
  }
}
