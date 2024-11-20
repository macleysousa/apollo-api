import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TabelaDePrecoConstraint } from 'src/commons/validations/is-tabela-de-preco.validation';

import { TabelaDePrecoEntity } from './entities/tabela-de-preco.entity';
import { ReferenciaModule } from './referencia/referencia.module';
import { TabelaDePrecoController } from './tabela-de-preco.controller';
import { TabelaDePrecoService } from './tabela-de-preco.service';

@Module({
  imports: [TypeOrmModule.forFeature([TabelaDePrecoEntity]), ReferenciaModule.forRoot()],
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
