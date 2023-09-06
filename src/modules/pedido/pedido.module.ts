import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { PedidoEntity } from './entities/pedido.entity';
import { PedidoItemModule } from './pedido-item/pedido-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoEntity]), PedidoItemModule],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
