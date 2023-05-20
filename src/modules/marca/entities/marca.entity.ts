import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'marcas' })
export class MarcaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  inativa: boolean;

  constructor(partial?: Partial<MarcaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
