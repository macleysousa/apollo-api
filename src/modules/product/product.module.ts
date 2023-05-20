import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColorConstraint } from 'src/commons/validations/is-color.validation';
import { MeasurementUnitConstraint } from 'src/commons/validations/is-measurement-unit.validation';
import { SizeConstraint } from 'src/commons/validations/is-size.validation';
import { CategoryConstraint } from 'src/commons/validations/is-category.validation';
import { SubCategoryConstraint } from 'src/commons/validations/is-category-sub.validation';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { BarcodeModule } from './barcode/barcode.module';
import { CorModule } from '../cor/cor.module';
import { MeasurementUnitModule } from '../measurement-unit/measurement-unit.module';
import { TamanhoModule } from '../tamanho/tamanho.module';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../category/sub/sub.module';
import { ReferenceConstraint } from 'src/commons/validations/is-reference.validation';
import { ReferenciaModule } from '../referencia/referencia.module';
import { BrandConstraint } from 'src/commons/validations/is-brand.validation';
import { BrandModule } from '../brand/brand.module';

@Module({
  imports: [
    BarcodeModule,
    TypeOrmModule.forFeature([ProductEntity]),
    MeasurementUnitModule,
    CorModule,
    TamanhoModule,
    CategoryModule,
    SubCategoryModule,
    ReferenciaModule,
    BrandModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    MeasurementUnitConstraint,
    ColorConstraint,
    SizeConstraint,
    CategoryConstraint,
    SubCategoryConstraint,
    ReferenceConstraint,
    BrandConstraint,
  ],
})
export class ProductModule {}
