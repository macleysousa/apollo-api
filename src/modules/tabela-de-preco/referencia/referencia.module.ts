import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrecoReferencia } from './entities/referencia.entity';
import { PrecoReferenciaController } from './referencia.controller';
import { PrecoReferenciaService } from './referencia.service';
import { PrecoReferenciaView } from './views/referencia.view';

@Module({
  imports: [TypeOrmModule.forFeature([PrecoReferencia, PrecoReferenciaView])],
  controllers: [PrecoReferenciaController],
  providers: [PrecoReferenciaService],
  exports: [PrecoReferenciaService],
})
export class ReferenciaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
