import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaixaConstraint } from 'src/commons/validations/is-caixa.validation';

import { CaixaController } from './caixa.controller';
import { CaixaService } from './caixa.service';
import { CancelarModule } from './cancelar/cancelar.module';
import { CaixaEntity } from './entities/caixa.entity';
import { ExtratoModule } from './extrato/extrato.module';
import { ReceberModule } from './receber/receber.module';

@Module({
  imports: [TypeOrmModule.forFeature([CaixaEntity]), ExtratoModule.forRoot(), ReceberModule, CancelarModule],
  controllers: [CaixaController],
  providers: [CaixaService, CaixaConstraint],
  exports: [CaixaService],
})
export class CaixaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
