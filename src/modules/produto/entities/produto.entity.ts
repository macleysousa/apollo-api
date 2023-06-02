import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CodigoBarrasEntity } from '../codigo-barras/entities/codigo-barras.entity';

import { BaseEntity } from 'src/commons/base.entity';
import { CorEntity } from 'src/modules/cor/entities/cor.entity';
import { ReferenciaEntity } from 'src/modules/referencia/entities/referencia.entity';
import { TamanhoEntity } from 'src/modules/tamanho/entities/tamanho.entity';

@Entity({ name: 'produtos' })
export class ProdutoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Exclude()
  @Column()
  referenciaId: number;

  @ApiProperty()
  @OneToOne(() => ReferenciaEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'referenciaId' })
  referencia: ReferenciaEntity;

  @ApiProperty()
  @Column()
  idExterno: string;

  @Exclude()
  @Column()
  corId: number;

  @ApiProperty()
  @OneToOne(() => CorEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'corId' })
  cor: CorEntity;

  @Exclude()
  @Column()
  tamanhoId: number;

  @ApiProperty()
  @OneToOne(() => TamanhoEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'tamanhoId' })
  tamanho: TamanhoEntity;

  @ApiProperty({ type: [String] })
  @OneToMany(() => CodigoBarrasEntity, (value) => value.produto, { eager: true })
  @Transform(({ value }) => {
    return value.map(({ code }) => code);
  })
  codigos: CodigoBarrasEntity[];

  constructor(partial?: Partial<ProdutoEntity>) {
    super();
    Object.assign(this, partial);
  }
}
