import { Module } from '@nestjs/common';
import { ConsignacaoItemService } from './consignacao-item.service';
import { ConsignacaoItemController } from './consignacao-item.controller';

@Module({
  controllers: [ConsignacaoItemController],
  providers: [ConsignacaoItemService],
})
export class ConsignacaoItemModule {}
