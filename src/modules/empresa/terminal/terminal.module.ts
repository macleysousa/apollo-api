import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TerminalConstraint } from 'src/commons/validations/is-terminal.validation';

import { TerminalService } from './terminal.service';
import { TerminalController } from './terminal.controller';
import { TerminalEntity } from './entities/terminal.entity';

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
