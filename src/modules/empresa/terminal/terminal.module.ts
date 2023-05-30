import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TerminalService } from './terminal.service';
import { TerminalController } from './terminal.controller';
import { TerminalEntity } from './entities/terminal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TerminalEntity])],
  controllers: [TerminalController],
  providers: [TerminalService],
  exports: [TerminalService],
})
export class TerminalModule {}
