import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriaConstraint } from 'src/commons/validations/is-categoria.validation';

import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './entities/category.entity';
import { SubCategoriaModule } from './sub/sub.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity]), SubCategoriaModule.forRoot()],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaConstraint],
  exports: [CategoriaService],
})
export class CategoriaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
