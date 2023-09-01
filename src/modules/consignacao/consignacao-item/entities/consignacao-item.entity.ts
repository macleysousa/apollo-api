import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { Exclude } from 'class-transformer';
import { ConsignacaoEntity } from '../../entities/consignacao.entity';

@Entity({ name: 'consignacoes_itens' })
export class ConsignacaoItemEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn('int')
  empresaId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  consignacaoId: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  romaneioId: number;

  @ApiProperty()
  @PrimaryColumn('int')
  sequencia: number;

  @ApiProperty()
  @PrimaryColumn('bigint')
  produtoId: number;

  @ApiProperty()
  @Column('decimal', { precision: 18, scale: 4 })
  quantidade: number;

  @ApiProperty()
  @Column('decimal', { precision: 18, scale: 4 })
  devolvido: number;

  @ApiProperty()
  @Column('decimal', { precision: 18, scale: 4 })
  acertado: number;

  @ApiProperty()
  @Column('int')
  operadorId: number;

  @Exclude()
  @ManyToOne(() => ConsignacaoEntity, (consignacao) => consignacao.id)
  @JoinColumn({ name: 'consignacaoId', referencedColumnName: 'id' })
  consignacao: ConsignacaoEntity;

  constructor(partial: Partial<ConsignacaoItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
