import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/commons/base.entity';

import { BarcodeEntity } from '../barcode/entities/barcode.entity';
import { Transform } from 'class-transformer';

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

  @ApiProperty()
  @Column()
  unitMeasureId: number;

  @ApiProperty()
  @Column()
  colorId: number;

  @ApiProperty()
  @Column()
  sizeId: number;

  @ApiProperty()
  @Column()
  categoryId: number;

  @ApiProperty()
  @Column()
  subCaregoryId: number;

  @ApiProperty()
  @Column()
  referenceId: number;

  @ApiProperty()
  @Column()
  brandId: number;

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
