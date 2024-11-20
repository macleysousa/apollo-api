import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaParametroEntity } from './entities/parametro.entity';
import { EmpresaParametroController } from './parametro.controller';
import { EmpresaParametroService } from './parametro.service';
import { EmpresaParametroView } from './views/parametro.view';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaParametroEntity, EmpresaParametroView])],
  controllers: [EmpresaParametroController],
  providers: [EmpresaParametroService],
  exports: [EmpresaParametroService],
})
export class ParametroModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
