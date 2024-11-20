import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PessoaModule } from '../pessoa.module';

import { PessoaEnderecoEntity } from './entities/pessoa-endereco.entity';
import { PessoaEnderecoController } from './pessoa-endereco.controller';
import { PessoaEnderecoService } from './pessoa-endereco.service';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaEnderecoEntity]), forwardRef(() => PessoaModule)],
  controllers: [PessoaEnderecoController],
  providers: [PessoaEnderecoService],
  exports: [PessoaEnderecoService],
})
export class PessoaEnderecoModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
