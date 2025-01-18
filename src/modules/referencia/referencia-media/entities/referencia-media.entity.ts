import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { MediaType } from 'src/commons/enum/media-type';
import { getR2Url } from 'src/helpers/r2';

@Entity('referencias_medias')
export class ReferenciaMediaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  referenciaId: number;

  @ApiProperty({ enum: MediaType })
  @Column('varchar')
  type: MediaType;

  @ApiProperty()
  @Column('varchar', { transformer: { to: (value) => getR2Url(value), from: (value) => value } })
  url: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column('boolean')
  isDefault: boolean;

  @ApiProperty()
  @Column('boolean')
  isPublic: boolean;

  constructor(partial: Partial<ReferenciaMediaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
