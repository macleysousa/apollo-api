import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

@Entity('ecommerce_referencias')
export class EcommerceReferenciaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  referenciaId: number;

  @ApiProperty()
  @Column('int')
  tabelaDePrecoId: number;

  @ApiProperty()
  @Column('boolean', { default: true })
  rascunho: boolean;
}
