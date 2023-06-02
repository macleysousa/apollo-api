import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaFormaPagamentoService } from './forma-de-pagamento.service';
import { EmpresaFormaPagamentoController } from './forma-de-pagamento.controller';
import { EmpresaFormaPagamentoEntity } from './entities/forma-de-pagamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaFormaPagamentoEntity])],
  controllers: [EmpresaFormaPagamentoController],
  providers: [EmpresaFormaPagamentoService],
})
export class EmpresaFormaPagamentoModule {}
