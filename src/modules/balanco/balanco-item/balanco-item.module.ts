import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalancoModule } from '../balanco.module';

import { BalancoItemController } from './balanco-item.controller';
import { BalancoItemService } from './balanco-item.service';
import { BalancoItemEntity } from './entities/balanco-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BalancoItemEntity]), forwardRef(() => BalancoModule)],
  controllers: [BalancoItemController],
  providers: [BalancoItemService],
  exports: [BalancoItemService],
})
export class BalancoItemModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
