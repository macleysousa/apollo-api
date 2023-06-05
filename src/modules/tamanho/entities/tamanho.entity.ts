import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'tamanhos' })
export class TamanhoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  inativo: boolean;

  constructor(partial?: Partial<TamanhoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
