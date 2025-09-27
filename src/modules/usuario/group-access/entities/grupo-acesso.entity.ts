import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { ComponenteGrupoEntity } from 'src/modules/componente-grupo/entities/componente-grupo.entity';

@Entity({ name: 'usuarios_grupos' })
export class UsuarioGrupoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  usuarioId: number;

  @ApiProperty()
  @PrimaryColumn()
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn()
  grupoId: number;

  @ApiProperty({ type: () => ComponenteGrupoEntity })
  @OneToOne(() => ComponenteGrupoEntity, (value) => value.id)
  @JoinColumn({ name: 'grupoId', referencedColumnName: 'id' })
  grupo: ComponenteGrupoEntity;

  @ApiProperty()
  @Column()
  operadorId: number;

  constructor(partial?: Partial<UsuarioGrupoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
