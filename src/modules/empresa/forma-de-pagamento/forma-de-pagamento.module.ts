import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaFormaPagamentoEntity } from './entities/forma-de-pagamento.entity';
import { EmpresaFormaPagamentoController } from './forma-de-pagamento.controller';
import { EmpresaFormaPagamentoService } from './forma-de-pagamento.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaFormaPagamentoEntity])],
  controllers: [EmpresaFormaPagamentoController],
  providers: [EmpresaFormaPagamentoService],
})
export class EmpresaFormaPagamentoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
