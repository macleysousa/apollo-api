import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReferenciaConstraint } from 'src/commons/validations/is-referencia.validation';

import { ReferenciaService } from './referencia.service';
import { ReferenciaController } from './referencia.controller';
import { ReferenciaEntity } from './entities/referencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReferenciaEntity])],
  controllers: [ReferenciaController],
  providers: [ReferenciaService, ReferenciaConstraint],
  exports: [ReferenciaService],
})
export class ReferenciaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
