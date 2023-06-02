import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubCategoriaConstraint } from 'src/commons/validations/is-categoria-sub.validation';

import { SubCategoriaService } from './sub.service';
import { SubCategoriaController } from './sub.controller';
import { SubCategoriaEntity } from './entities/sub.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoriaEntity])],
  controllers: [SubCategoriaController],
  providers: [SubCategoriaService, SubCategoriaConstraint],
  exports: [SubCategoriaService],
})
export class SubCategoriaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
