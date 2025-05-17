import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransacaoPontoEntity } from './entities/transacao-ponto.entity';
import { TransacaoPontoController } from './transacao-ponto.controller';
import { TransacaoPontoService } from './transacao-ponto.service';
import { TransacaoPontoView } from './Views/transacao-ponto.view';

@Module({
  imports: [TypeOrmModule.forFeature([TransacaoPontoEntity, TransacaoPontoView])],
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
