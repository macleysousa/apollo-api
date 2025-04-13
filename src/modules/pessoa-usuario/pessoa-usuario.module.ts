import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PessoaUsuario } from './entities/pessoa-usuario.entity';
import { PessoaUsuarioController } from './pessoa-usuario.controller';
import { PessoaUsuarioService } from './pessoa-usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaUsuario]), HttpModule],
  controllers: [PessoaUsuarioController],
  providers: [PessoaUsuarioService],
})
export class PessoaUsuarioModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
