import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories_subs' })
export class SubCategoryEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({})
  categoryId: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  active: boolean;

  constructor(partial?: Partial<SubCategoryEntity>) {
    super();
    Object.assign(this, partial);
  }
}
