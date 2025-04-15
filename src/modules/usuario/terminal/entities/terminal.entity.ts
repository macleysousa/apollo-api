import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, PrimaryColumn } from 'typeorm';

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

  constructor(partial?: Partial<UsuarioTerminalEntity>) {
    Object.assign(this, partial);
  }
}
