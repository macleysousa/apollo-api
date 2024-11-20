import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MarcaConstraint } from 'src/commons/validations/is-marca.validation';

import { MarcaEntity } from './entities/marca.entity';
import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';

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
