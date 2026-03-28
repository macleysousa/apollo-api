import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'cores' })
export class CorEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true, length: 9 })
  hex?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  nomeInternacional?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  base?: string;

  @ApiProperty({ required: false, type: [String] })
  @Column('simple-array', { nullable: true })
  tags?: string[];

  @ApiProperty()
  @Column()
  inativa: boolean;

  constructor(partial?: Partial<CorEntity>) {
    super();
    Object.assign(this, partial);
  }
}
