import { Module } from '@nestjs/common';
import { UsuarioTerminalService } from './terminal.service';
import { UsuarioTerminalController } from './terminal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioTerminalEntity } from './entities/terminal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioTerminalEntity])],
  controllers: [UsuarioTerminalController],
  providers: [UsuarioTerminalService],
  exports: [UsuarioTerminalService],
})
export class UsuarioTerminalModule {}
