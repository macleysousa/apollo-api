import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RomaneioModule } from '../romaneio.module';
import { RomaneioFreteEntity } from './entities/romaneio-frete.entity';
import { RomaneioFreteController } from './romaneio-frete.controller';
import { RomaneioFreteService } from './romaneio-frete.service';

@Module({
  imports: [TypeOrmModule.forFeature([RomaneioFreteEntity]), forwardRef(() => RomaneioModule)],
  controllers: [RomaneioFreteController],
  providers: [RomaneioFreteService],
  exports: [RomaneioFreteService],
})
export class RomaneioFreteModule {}
