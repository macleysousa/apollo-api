import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsignacaoController } from './consignacao.controller';
import { ConsignacaoService } from './consignacao.service';
import { ConsignacaoEntity } from './entities/consignacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConsignacaoEntity])],
  controllers: [ConsignacaoController],
  providers: [ConsignacaoService],
  exports: [ConsignacaoService],
})
export class ConsignacaoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
