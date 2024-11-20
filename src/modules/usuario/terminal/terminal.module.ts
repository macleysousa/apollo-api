import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioTerminalEntity } from './entities/terminal.entity';
import { UsuarioTerminalController } from './terminal.controller';
import { UsuarioTerminalService } from './terminal.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioTerminalEntity])],
  controllers: [UsuarioTerminalController],
  providers: [UsuarioTerminalService],
  exports: [UsuarioTerminalService],
})
export class UsuarioTerminalModule {}
