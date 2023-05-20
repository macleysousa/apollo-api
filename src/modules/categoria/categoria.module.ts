import { Module, DynamicModule } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from './entities/category.entity';
import { SubCategoriaModule } from './sub/sub.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity]), SubCategoriaModule.forRoot()],
  controllers: [CategoriaController],
  providers: [CategoriaService],
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
