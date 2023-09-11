import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProdutoConstraint } from 'src/commons/validations/is-produto.validation';

import { CodigoBarraseModule } from './codigo-barras/codigo-barras.module';
import { ProdutoEntity } from './entities/produto.entity';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { ProdutoComPrecoView } from './views/produto-com-preco.view';

@Module({
  imports: [CodigoBarraseModule, TypeOrmModule.forFeature([ProdutoEntity, ProdutoComPrecoView])],
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
