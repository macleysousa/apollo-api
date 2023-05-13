import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from 'src/commons/base.entity';

@Entity({ name: 'components' })
export class ComponentEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  deprecated: Boolean;
}
