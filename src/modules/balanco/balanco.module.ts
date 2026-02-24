import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalancoController } from './balanco.controller';
import { BalancoService } from './balanco.service';
import { BalancoItemModule } from './balanco-item/balanco-item.module';
import { BalancoItemEntity } from './balanco-item/entities/balanco-item.entity';
import { BalancoLoteModule } from './balanco-lote/balanco-lote.module';
import { BalancoLoteItemModule } from './balanco-lote/balanco-lote-item/balanco-lote-item.module';
import { BalancoLoteItemEntity } from './balanco-lote/balanco-lote-item/entities/balanco-lote-item.entity';
import { BalancoEntity } from './entities/balanco.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalancoEntity, BalancoItemEntity, BalancoLoteItemEntity]),
    BalancoItemModule.forRoot(),
    BalancoLoteModule,
    BalancoLoteItemModule,
  ],
  controllers: [BalancoController],
  providers: [BalancoService],
  exports: [BalancoService],
})
export class BalancoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
