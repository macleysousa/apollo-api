import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaixaConstraint } from 'src/commons/validations/is-caixa.validation';

import { CaixaService } from './caixa.service';
import { CaixaController } from './caixa.controller';
import { CaixaEntity } from './entities/caixa.entity';
import { ExtratoModule } from './extrato/extrato.module';
import { ReceberModule } from './receber/receber.module';
import { CancelarModule } from './cancelar/cancelar.module';

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
