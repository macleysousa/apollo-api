import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaParametroService } from './parametro.service';
import { EmpresaParametroController } from './parametro.controller';
import { EmpresaParametroEntity } from './entities/parametro.entity';
import { EmpresaParametroView } from './views/paramentro.view';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaParametroEntity, EmpresaParametroView])],
  controllers: [EmpresaParametroController],
  providers: [EmpresaParametroService],
  exports: [EmpresaParametroService],
})
export class ParametroModule {}
