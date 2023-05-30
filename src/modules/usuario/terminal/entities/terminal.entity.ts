import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { TerminalEntity } from 'src/modules/empresa/terminal/entities/terminal.entity';

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
  @JoinColumn({ name: 'empresaId', referencedColumnName: 'empresaId' })
  @JoinColumn({ name: 'terminalId', referencedColumnName: 'id' })
  terminal: TerminalEntity;

  constructor(partial?: Partial<UsuarioTerminalEntity>) {
    Object.assign(this, partial);
  }
}
