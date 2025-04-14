import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioController } from './pessoa-usuario.controller';
import { PessoaUsuarioService } from './pessoa-usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaUsuario])],
  controllers: [PessoaUsuarioController],
  providers: [PessoaUsuarioService],
  exports: [PessoaUsuarioService],
})
export class PessoaUsuarioModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
