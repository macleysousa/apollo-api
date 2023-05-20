import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/commons/base.entity';

import { BarcodeEntity } from '../barcode/entities/barcode.entity';
import { Exclude, Transform } from 'class-transformer';
import { MeasurementUnitEntity } from 'src/modules/measurement-unit/entities/measurement-unit.entity';
import { CorEntity } from 'src/modules/cor/entities/cor.entity';
import { TamanhoEntity } from 'src/modules/tamanho/entities/tamanho.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { SubCategoryEntity } from 'src/modules/category/sub/entities/sub.entity';
import { ReferenciaEntity } from 'src/modules/referencia/entities/referencia.entity';
import { BrandEntity } from 'src/modules/brand/entities/brand.entity';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  externalId: string;

  @Exclude()
  @Column()
  measurementUnitId: number;

  @ApiProperty()
  @OneToOne(() => MeasurementUnitEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'measurementUnitId' })
  measurementUnit: MeasurementUnitEntity;

  @Exclude()
  @Column()
  colorId: number;

  @ApiProperty()
  @OneToOne(() => CorEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'colorId' })
  color: CorEntity;

  @Exclude()
  @Column()
  sizeId: number;

  @ApiProperty()
  @OneToOne(() => TamanhoEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'sizeId' })
  size: TamanhoEntity;

  @Exclude()
  @Column()
  categoryId: number;

  @ApiProperty()
  @OneToOne(() => CategoryEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Exclude()
  @Column()
  subCategoryId: number;

  @ApiProperty()
  @OneToOne(() => SubCategoryEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategoryEntity;

  @Exclude()
  @Column()
  referenceId: number;

  @ApiProperty()
  @OneToOne(() => ReferenciaEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'referenceId' })
  reference: ReferenciaEntity;

  @Exclude()
  @Column()
  brandId: number;

  @ApiProperty()
  @OneToOne(() => BrandEntity, (value) => value.id, { eager: true })
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @ApiProperty({ type: [String] })
  @OneToMany(() => BarcodeEntity, (value) => value.product, { eager: true })
  @Transform(({ value }) => {
    return value.map(({ code }) => code);
  })
  barcodes: BarcodeEntity[];

  constructor(partial?: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
