import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Relation } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';

import { CaixaContagemItemEntity } from './contagem-item.entity';

@Entity({ name: 'caixas_contagem' })
export class CaixaContagemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('date')
  data: Date;

  @ApiProperty()
  @PrimaryColumn('bigint')
  caixaId: number;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @ApiProperty()
  @Column('varchar', { length: 500, nullable: true })
  observacao: string;

  @ApiProperty({ type: () => [CaixaContagemItemEntity] })
  @OneToMany(() => CaixaContagemItemEntity, (item) => item.contagem, { cascade: true })
  items: Relation<CaixaContagemItemEntity[]>;

  constructor(partial?: Partial<CaixaContagemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
