import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';
import { PessoaExtratoController } from './pessoa-extrato.controller';
import { PessoaExtratoService } from './pessoa-extrato.service';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaExtratoEntity])],
  controllers: [PessoaExtratoController],
  providers: [PessoaExtratoService],
  exports: [PessoaExtratoService],
})
export class PessoaExtratoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
