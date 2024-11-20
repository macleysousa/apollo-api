import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from 'src/commons/base.entity';
import { UnidadeMedida } from 'src/commons/enum/unidade-medida.enum';
import { CategoriaEntity } from 'src/modules/categoria/entities/category.entity';
import { SubCategoriaEntity } from 'src/modules/categoria/sub/entities/sub.entity';

@Entity({ name: 'referencias' })
export class ReferenciaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nome: string;

  @ApiProperty()
  @Column()
  idExterno: string;

  @ApiProperty({ enum: UnidadeMedida })
  @Column()
  unidadeMedida: UnidadeMedida;

  @Exclude()
  @Column()
  categoriaId: number;

  @ApiProperty()
  @OneToOne(() => CategoriaEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'categoriaId' })
  categoria: CategoriaEntity;

  @Exclude()
  @Column()
  subCategoriaId: number;

  @ApiProperty()
  @OneToOne(() => SubCategoriaEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'subCategoriaId' })
  subCategoria: SubCategoriaEntity;

  @ApiProperty()
  @Column()
  marcaId: number;

  @ApiProperty()
  @Column()
  descricao: string;

  @ApiProperty()
  @Column()
  composicao: string;

  @ApiProperty()
  @Column()
  cuidados: string;

  constructor(partial?: Partial<ReferenciaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
