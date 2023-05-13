import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioGrupoEntity } from './entities/grupo-acesso.entity';
import { UsuarioGrupoController } from './grupo-acesso.controller';
import { UsuarioGrupoService } from './grupo-acesso.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioGrupoEntity])],
  controllers: [UsuarioGrupoController],
  providers: [UsuarioGrupoService],
})
export class GroupAccessModule {}
