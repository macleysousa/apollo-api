import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoController } from './transacao-ponto.controller';
import { TransacaoPontoService } from './transacao-ponto.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransacaoPontoEntity])],
  controllers: [TransacaoPontoController],
  providers: [TransacaoPontoService],
})
export class TransacaoPontoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
