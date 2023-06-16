import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaixaConstraint } from 'src/commons/validations/is-caixa.validation';

import { CaixaService } from './caixa.service';
import { CaixaController } from './caixa.controller';
import { CaixaEntity } from './entities/caixa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaixaEntity])],
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
