import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { ProductEntity } from '../../entities/product.entity';

@Entity({ name: 'products_barcodes' })
export class BarcodeEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  code: string;

  @Exclude()
  @Column()
  productId: number;

  @Exclude()
  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  constructor(partial?: Partial<BarcodeEntity>) {
    Object.assign(this, partial);
  }
}
