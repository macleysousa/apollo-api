import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TerminalConstraint } from 'src/commons/validations/is-terminal.validation';

import { TerminalEntity } from './entities/terminal.entity';
import { TerminalController } from './terminal.controller';
import { TerminalService } from './terminal.service';

@Module({
  imports: [TypeOrmModule.forFeature([TerminalEntity])],
  controllers: [TerminalController],
  providers: [TerminalService, TerminalConstraint],
  exports: [TerminalService],
})
export class TerminalModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
