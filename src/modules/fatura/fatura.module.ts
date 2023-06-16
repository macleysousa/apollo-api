import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FaturaService } from './fatura.service';
import { FaturaController } from './fatura.controller';
import { FaturaEntity } from './entities/fatura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaturaEntity])],
  controllers: [FaturaController],
  providers: [FaturaService],
  exports: [FaturaService],
})
export class FaturaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
