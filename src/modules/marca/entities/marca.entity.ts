import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'marcas' })
export class MarcaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column('varchar', { length: 255, unique: true })
  nome: string;

  @ApiProperty()
  @Column({ default: false })
  inativa: boolean;

  constructor(partial?: Partial<MarcaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
