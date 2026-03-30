import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { getR2Url } from 'src/helpers/r2';

@Entity('ecommerces')
export class EcommerceEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @Column('varchar')
  titulo: string;

  @ApiProperty()
  @Column('varchar')
  subtitulo: string;

  @ApiProperty()
  @Column('text')
  descricao: string;

  @ApiProperty()
  @Column('varchar', { transformer: { to: (value) => getR2Url(value), from: (value) => value } })
  icone: string;
}
