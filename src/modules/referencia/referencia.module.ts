import { Module, DynamicModule } from '@nestjs/common';
import { ReferenciaService } from './referencia.service';
import { ReferenciaController } from './referencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenciaEntity } from './entities/referencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReferenciaEntity])],
  controllers: [ReferenciaController],
  providers: [ReferenciaService],
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
