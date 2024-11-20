import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParametroConstraint } from 'src/commons/validations/is-parametro.validation';

import { ParametroEntity } from './entities/parametro.entity';
import { ParametroController } from './parametro.controller';
import { ParametroService } from './parametro.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParametroEntity])],
  controllers: [ParametroController],
  providers: [ParametroService, ParametroConstraint],
  exports: [ParametroService],
})
export class ParametroModule {
  constructor(private service: ParametroService) {
    this.service.popular();
  }

  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
