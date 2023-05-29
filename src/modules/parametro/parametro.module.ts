import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParametroService } from './parametro.service';
import { ParametroController } from './parametro.controller';
import { ParametroEntity } from './entities/parametro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParametroEntity])],
  controllers: [ParametroController],
  providers: [ParametroService],
  exports: [ParametroService],
})
export class ParametroModule {
  constructor(private service: ParametroService) {
    this.service.popular();
  }

  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
