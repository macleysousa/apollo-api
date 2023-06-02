import { Module, DynamicModule } from '@nestjs/common';

import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaEntity } from './entities/marca.entity';
import { MarcaConstraint } from 'src/commons/validations/is-marca.validation';

@Module({
  imports: [TypeOrmModule.forFeature([MarcaEntity])],
  controllers: [MarcaController],
  providers: [MarcaService, MarcaConstraint],
  exports: [MarcaService],
})
export class MarcaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
