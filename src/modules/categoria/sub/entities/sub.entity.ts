import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'categorias_subs' })
export class SubCategoriaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({})
  categoriaId: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  inativa: boolean;

  constructor(partial?: Partial<SubCategoriaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
