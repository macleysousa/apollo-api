import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaParametroService } from './parametro.service';
import { EmpresaParametroController } from './parametro.controller';
import { EmpresaParametroEntity } from './entities/parametro.entity';
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
