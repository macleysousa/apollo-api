import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/commons/base.entity';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';

@Entity({ name: 'product_barcodes' })
export class BarcodeEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @Column()
  productId: number;

  @ApiProperty()
  @OneToMany(() => ProductEntity, (product) => product.id)
  product: ProductEntity;

  constructor(partial?: Partial<BarcodeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
