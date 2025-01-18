import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReferenciaConstraint } from 'src/commons/validations/is-referencia.validation';

import { ReferenciaEntity } from './entities/referencia.entity';
import { ReferenciaController } from './referencia.controller';
import { ReferenciaService } from './referencia.service';
import { ReferenciaMediaModule } from './referencia-media/referencia-media.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReferenciaEntity]), ReferenciaMediaModule],
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
