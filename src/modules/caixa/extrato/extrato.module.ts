import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaixaExtratoEntity } from './entities/extrato.entity';
import { CaixaExtratoController } from './extrato.controller';
import { CaixaExtratoService } from './extrato.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaixaExtratoEntity])],
  controllers: [CaixaExtratoController],
  providers: [CaixaExtratoService],
  exports: [CaixaExtratoService],
})
export class ExtratoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
