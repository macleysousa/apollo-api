import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuncionarioConstraint } from 'src/commons/validations/is-funcionario.validation';

import { FuncionarioEntity } from './entities/funcionario.entity';
import { FuncionarioController } from './funcionario.controller';
import { FuncionarioService } from './funcionario.service';

@Module({
  imports: [TypeOrmModule.forFeature([FuncionarioEntity])],
  controllers: [FuncionarioController],
  providers: [FuncionarioService, FuncionarioConstraint],
  exports: [FuncionarioService],
})
export class FuncionarioModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
