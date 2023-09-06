import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidoItemEntity } from './entities/pedido-item.entity';
import { PedidoItemController } from './pedido-item.controller';
import { PedidoItemService } from './pedido-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoItemEntity])],
  controllers: [PedidoItemController],
  providers: [PedidoItemService],
  exports: [PedidoItemService],
})
export class PedidoItemModule {}
