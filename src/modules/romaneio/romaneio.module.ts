import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RomaneioService } from './romaneio.service';
import { RomaneioController } from './romaneio.controller';
import { RomaneioEntity } from './entities/romaneio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RomaneioEntity])],
  controllers: [RomaneioController],
  providers: [RomaneioService],
  exports: [RomaneioService],
})
export class RomaneioModule {}
