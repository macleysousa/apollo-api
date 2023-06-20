import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FaturaParcelaController } from './parcela.controller';
import { FaturaParcelaService } from './parcela.service';
import { FaturaParcelaEntity } from './entities/parcela.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaturaParcelaEntity])],
  controllers: [FaturaParcelaController],
  providers: [FaturaParcelaService],
  exports: [FaturaParcelaService],
})
export class ParcelaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
