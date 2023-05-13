import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { ComponenteEntity } from 'src/modules/componente/entities/componente.entity';

import { ComponenteGrupoEntity } from '../../entities/componente-grupo.entity';

@Entity({ name: 'componentes_grupos_itens' })
export class ComponenteGrupoItemEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  grupoId: number;

  @Exclude()
  @Column()
  componenteId: string;

  @ApiProperty({ type: () => ComponenteEntity })
  @OneToOne(() => ComponenteEntity, (value) => value.id)
  @JoinColumn({ name: 'componenteId', referencedColumnName: 'id' })
  componente: ComponenteEntity;

  @Exclude()
  @ManyToOne(() => ComponenteGrupoEntity, (value) => value.id)
  @JoinColumn({ name: 'grupoId', referencedColumnName: 'id' })
  grupo: ComponenteGrupoEntity;

  constructor(partial?: Partial<ComponenteGrupoItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
