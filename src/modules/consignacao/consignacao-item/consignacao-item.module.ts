import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsignacaoItemController } from './consignacao-item.controller';
import { ConsignacaoItemService } from './consignacao-item.service';
import { ConsignacaoItemEntity } from './entities/consignacao-item.entity';
import { ConsignacaoItemView } from './views/consignacao-item.view';

@Module({
  imports: [TypeOrmModule.forFeature([ConsignacaoItemEntity, ConsignacaoItemView])],
  controllers: [ConsignacaoItemController],
  providers: [ConsignacaoItemService],
  exports: [ConsignacaoItemService],
})
export class ConsignacaoItemModule {}
