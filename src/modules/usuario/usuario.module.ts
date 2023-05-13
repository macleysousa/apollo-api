import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioEntity } from './entities/usuario.entity';
import { IsUsuarioConstraint } from './validations/is-usuario-unique.validation';
import { GroupAccessModule } from './group-access/grupo-acesso.module';
import { UsuarioAcessoEntity } from './entities/usuario-acessos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, UsuarioAcessoEntity]), GroupAccessModule],
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
