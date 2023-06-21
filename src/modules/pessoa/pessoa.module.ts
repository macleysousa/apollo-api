import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IsPessoaConstraint } from 'src/commons/validations/is-pessoa.validation';

import { PessoaExtratoModule } from './extrato/pessoa-extrato.module';
import { PessoaEnderecoModule } from './endereco/pessoa-endereco.module';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';
import { IsDocumentoConstraint } from './validation/is-documento-unique.validation';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaEntity]), PessoaEnderecoModule.forRoot(), PessoaExtratoModule.forRoot()],
  controllers: [PessoaController],
  providers: [PessoaService, IsPessoaConstraint, IsDocumentoConstraint],
  exports: [PessoaService],
})
export class PessoaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
