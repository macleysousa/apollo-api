import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TamanhoConstraint } from 'src/commons/validations/is-tamanho.validation';

import { TamanhoEntity } from './entities/tamanho.entity';
import { TamanhoController } from './tamanho.controller';
import { TamanhoService } from './tamanho.service';

@Module({
  imports: [TypeOrmModule.forFeature([TamanhoEntity])],
  controllers: [TamanhoController],
  providers: [TamanhoService, TamanhoConstraint],
  exports: [TamanhoService],
})
export class TamanhoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
