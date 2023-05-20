import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ComponenteGrupoItemEntity } from '../item/entities/componente-grupo-item.entity';

@Entity({ name: 'componentes_grupos' })
export class ComponenteGrupoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty({ type: () => ComponenteGrupoItemEntity, isArray: true })
  @OneToMany(() => ComponenteGrupoItemEntity, (value) => value.grupo)
  itens: ComponenteGrupoItemEntity[];

  constructor(partial?: Partial<ComponenteGrupoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
