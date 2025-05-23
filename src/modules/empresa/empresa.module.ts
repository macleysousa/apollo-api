import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaConstraint } from 'src/commons/validations/is-empresa.validation';

import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { EmpresaEntity } from './entities/empresa.entity';
import { EmpresaFormaPagamentoModule } from './forma-de-pagamento/forma-de-pagamento.module';
import { ParametroModule } from './parametro/parametro.module';
import { TerminalModule } from './terminal/terminal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpresaEntity]),
    TerminalModule.forRoot(),
    EmpresaFormaPagamentoModule.forRoot(),
    ParametroModule.forRoot(),
  ],
  controllers: [EmpresaController],
  providers: [EmpresaService, EmpresaConstraint],
  exports: [EmpresaService],
})
export class EmpresaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
