import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstoqueEntity } from './entities/estoque.entity';
import { EstoqueController } from './estoque.controller';
import { EstoqueService } from './estoque.service';
import { EstoqueView } from './views/estoque.view';

@Module({
  imports: [TypeOrmModule.forFeature([EstoqueEntity, EstoqueView])],
  controllers: [EstoqueController],
  providers: [EstoqueService],
  exports: [EstoqueService],
})
export class EstoqueModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
