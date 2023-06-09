import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RomaneioItemEntity } from './entities/romaneio-item.entity';
import { RomaneioItemController } from './romaneio-item.controller';
import { RomaneioItemService } from './romaneio-item.service';
import { RomaneioModule } from '../romaneio.module';

@Module({
  imports: [TypeOrmModule.forFeature([RomaneioItemEntity]), forwardRef(() => RomaneioModule)],
  controllers: [RomaneioItemController],
  providers: [RomaneioItemService],
  exports: [RomaneioItemService],
})
export class RomaneioItemModule {}
