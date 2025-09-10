import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { ComponenteEntity } from 'src/modules/componente/entities/componente.entity';

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
  @Transform(({ value }) => value?.map((item: ComponenteGrupoItemEntity) => item.componente))
  componentes: ComponenteEntity[];

  constructor(partial?: Partial<ComponenteGrupoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
