import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalancoModule } from '../../balanco.module';
import { BalancoItemEntity } from '../../balanco-item/entities/balanco-item.entity';
import { BalancoLoteEntity } from '../entities/balanco-lote.entity';

import { BalancoLoteItemController } from './balanco-lote-item.controller';
import { BalancoLoteItemService } from './balanco-lote-item.service';
import { BalancoLoteItemEntity } from './entities/balanco-lote-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalancoLoteItemEntity, BalancoLoteEntity, BalancoItemEntity]),
    forwardRef(() => BalancoModule),
  ],
  controllers: [BalancoLoteItemController],
  providers: [BalancoLoteItemService],
  exports: [BalancoLoteItemService],
})
export class BalancoLoteItemModule {}
