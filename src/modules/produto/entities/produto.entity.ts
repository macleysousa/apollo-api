import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/commons/base.entity';

import { CodigoBarrasEntity } from '../codigo-barras/entities/codigo-barras.entity';
import { Exclude, Transform } from 'class-transformer';
import { CorEntity } from 'src/modules/cor/entities/cor.entity';
import { TamanhoEntity } from 'src/modules/tamanho/entities/tamanho.entity';
import { CategoriaEntity } from 'src/modules/categoria/entities/category.entity';
import { SubCategoriaEntity } from 'src/modules/categoria/sub/entities/sub.entity';
import { ReferenciaEntity } from 'src/modules/referencia/entities/referencia.entity';

@Entity({ name: 'produtos' })
export class ProdutoEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  descricao: string;

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

  @Exclude()
  @Column()
  referenciaId: number;

  @ApiProperty()
  @OneToOne(() => ReferenciaEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'referenciaId' })
  referencia: ReferenciaEntity;

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
