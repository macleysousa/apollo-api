import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormaPagamentoConstraint } from 'src/commons/validations/is-forma-pagamento.validation';

import { FormaDePagamentoEntity } from './entities/forma-de-pagamento.entity';
import { FormaDePagamentoController } from './forma-de-pagamento.controller';
import { FormaDePagamentoService } from './forma-de-pagamento.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormaDePagamentoEntity])],
  controllers: [FormaDePagamentoController],
  providers: [FormaDePagamentoService, FormaPagamentoConstraint],
  exports: [FormaDePagamentoService],
})
export class FormaDePagamentoModule {}
