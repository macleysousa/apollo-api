import { DynamicModule, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PessoaEnderecoService } from './pessoa-endereco.service';
import { PessoaEnderecoController } from './pessoa-endereco.controller';
import { PessoaEnderecoEntity } from './entities/pessoa-endereco.entity';
import { PessoaModule } from '../pessoa.module';

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
