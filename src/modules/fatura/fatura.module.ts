import { Module, DynamicModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FaturaService } from './fatura.service';
import { FaturaController } from './fatura.controller';
import { FaturaEntity } from './entities/fatura.entity';
import { ParcelaModule } from './parcela/parcela.module';

@Module({
  imports: [TypeOrmModule.forFeature([FaturaEntity]), ParcelaModule.forRoot()],
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
