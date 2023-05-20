import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProdutoEntity } from '../../entities/produto.entity';

@Entity({ name: 'produtos_codigos_barras' })
export class CodigoBarrasEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  codigo: string;

  @Exclude()
  @Column()
  produtoId: number;

  @Exclude()
  @ManyToOne(() => ProdutoEntity, (product) => product.id)
  @JoinColumn({ name: 'produtoId', referencedColumnName: 'id' })
  produto: ProdutoEntity;

  constructor(partial?: Partial<CodigoBarrasEntity>) {
    Object.assign(this, partial);
  }
}
