import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RomaneioModule } from '../romaneio.module';

import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioItemController } from './romaneio-item.controller';
import { RomaneioItemService } from './romaneio-item.service';
import { RomaneioItemView } from './views/romaneio-item.view';

@Module({
  imports: [TypeOrmModule.forFeature([RomaneioItemEntity, RomaneioItemView]), forwardRef(() => RomaneioModule)],
  controllers: [RomaneioItemController],
  providers: [RomaneioItemService],
  exports: [RomaneioItemService],
})
export class RomaneioItemModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
