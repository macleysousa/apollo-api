import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioAcessoEntity } from './entities/usuario-acessos.entity';
import { GroupAccessModule } from './group-access/grupo-acesso.module';
import { UsuarioTerminalModule } from './terminal/terminal.module';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { IsUsuarioConstraint } from './validations/is-usuario-unique.validation';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, UsuarioAcessoEntity]), GroupAccessModule, UsuarioTerminalModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, IsUsuarioConstraint],
  exports: [UsuarioService],
})
export class UsuarioModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: UsuarioModule,
    };
  }
}
