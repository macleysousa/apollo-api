import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'componentes' })
export class ComponenteEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  descontinuado: Boolean;
}
