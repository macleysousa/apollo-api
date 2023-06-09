import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RomaneioService } from './romaneio.service';
import { RomaneioController } from './romaneio.controller';
import { RomaneioEntity } from './entities/romaneio.entity';
import { RomaneioItemModule } from './romaneio-item/romaneio-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([RomaneioEntity]), RomaneioItemModule],
  controllers: [RomaneioController],
  providers: [RomaneioService],
  exports: [RomaneioService],
})
export class RomaneioModule {}
