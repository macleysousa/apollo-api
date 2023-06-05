import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TabelaDePrecoConstraint } from 'src/commons/validations/is-tabela-de-preco.validation';

import { TabelaDePrecoService } from './tabela-de-preco.service';
import { TabelaDePrecoController } from './tabela-de-preco.controller';
import { TabelaDePrecoEntity } from './entities/tabela-de-preco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TabelaDePrecoEntity])],
  controllers: [TabelaDePrecoController],
  providers: [TabelaDePrecoService, TabelaDePrecoConstraint],
  exports: [TabelaDePrecoService],
})
export class TabelaDePrecoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
