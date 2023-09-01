import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsignacaoItemModule } from './consignacao-item/consignacao-item.module';
import { ConsignacaoController } from './consignacao.controller';
import { ConsignacaoService } from './consignacao.service';
import { ConsignacaoEntity } from './entities/consignacao.entity';
import { ConsignacaoView } from './views/consignacao.view';

@Module({
  imports: [TypeOrmModule.forFeature([ConsignacaoEntity, ConsignacaoView]), ConsignacaoItemModule],
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
