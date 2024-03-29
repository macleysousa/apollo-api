import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RomaneioConstraint } from 'src/commons/validations/is-romaneio.validation';

import { RomaneioService } from './romaneio.service';
import { RomaneioController } from './romaneio.controller';
import { RomaneioEntity } from './entities/romaneio.entity';
import { RomaneioItemModule } from './romaneio-item/romaneio-item.module';
import { RomaneioView } from './views/romaneio.view';
import { RomaneioFreteModule } from './romaneio-frete/romaneio-frete.module';

@Module({
  imports: [TypeOrmModule.forFeature([RomaneioEntity, RomaneioView]), RomaneioItemModule.forRoot(), RomaneioFreteModule],
  controllers: [RomaneioController],
  providers: [RomaneioService, RomaneioConstraint],
  exports: [RomaneioService],
})
export class RomaneioModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
