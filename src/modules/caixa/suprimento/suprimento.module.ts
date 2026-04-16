import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaixaSuprimentoEntity } from './entities/suprimento.entity';
import { CaixaSuprimentoController } from './suprimento.controller';
import { CaixaSuprimentoService } from './suprimento.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaixaSuprimentoEntity])],
  controllers: [CaixaSuprimentoController],
  providers: [CaixaSuprimentoService],
  exports: [CaixaSuprimentoService],
})
export class SuprimentoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
