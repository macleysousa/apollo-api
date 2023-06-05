import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IsPessoaConstraint } from 'src/commons/validations/is-pessoa.validation';

import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';
import { IsDocumentoConstraint } from './validation/is-documento-unique.validation';
import { PessoaEntity } from './entities/pessoa.entity';
import { PessoaEnderecoModule } from './pessoa-endereco/pessoa-endereco.module';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaEntity]), PessoaEnderecoModule],
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
