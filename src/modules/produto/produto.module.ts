import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColorConstraint } from 'src/commons/validations/is-color.validation';
import { SizeConstraint } from 'src/commons/validations/is-size.validation';
import { CategoryConstraint } from 'src/commons/validations/is-category.validation';
import { SubCategoryConstraint } from 'src/commons/validations/is-category-sub.validation';

import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { ProdutoEntity } from './entities/produto.entity';
import { CodigoBarraseModule } from './codigo-barras/codigo-barras.module';
import { CorModule } from '../cor/cor.module';
import { TamanhoModule } from '../tamanho/tamanho.module';
import { CategoriaModule } from '../categoria/categoria.module';
import { SubCategoriaModule } from '../categoria/sub/sub.module';
import { ReferenceConstraint } from 'src/commons/validations/is-reference.validation';
import { ReferenciaModule } from '../referencia/referencia.module';
import { BrandConstraint } from 'src/commons/validations/is-brand.validation';
import { MarcaModule } from '../marca/marca.module';

@Module({
  imports: [
    CodigoBarraseModule,
    TypeOrmModule.forFeature([ProdutoEntity]),
    CorModule,
    TamanhoModule,
    CategoriaModule,
    SubCategoriaModule,
    ReferenciaModule,
    MarcaModule,
  ],
  controllers: [ProdutoController],
  providers: [
    ProdutoService,
    ColorConstraint,
    SizeConstraint,
    CategoryConstraint,
    SubCategoryConstraint,
    ReferenceConstraint,
    BrandConstraint,
  ],
})
export class ProdutoModule {}
