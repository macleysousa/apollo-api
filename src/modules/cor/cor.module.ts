import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColorConstraint } from 'src/commons/validations/is-color.validation';

import { CorService } from './cor.service';
import { CorController } from './cor.controller';
import { CorEntity } from './entities/cor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CorEntity])],
  controllers: [CorController],
  providers: [CorService, ColorConstraint],
  exports: [CorService],
})
export class CorModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
