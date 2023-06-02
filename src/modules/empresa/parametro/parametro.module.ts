import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParametroService } from './parametro.service';
import { ParametroController } from './parametro.controller';
import { EmpresaParametroEntity } from './entities/parametro.entity';
import { EmpresaParametroView } from './views/paramentro.view';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaParametroEntity, EmpresaParametroView])],
  controllers: [ParametroController],
  providers: [ParametroService],
  exports: [ParametroService],
})
export class ParametroModule {}
