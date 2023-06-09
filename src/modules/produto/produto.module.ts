import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProdutoConstraint } from 'src/commons/validations/is-produto.validation';

import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { ProdutoEntity } from './entities/produto.entity';
import { CodigoBarraseModule } from './codigo-barras/codigo-barras.module';

@Module({
  imports: [CodigoBarraseModule, TypeOrmModule.forFeature([ProdutoEntity])],
  controllers: [ProdutoController],
  providers: [ProdutoService, ProdutoConstraint],
  exports: [ProdutoService],
})
export class ProdutoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
