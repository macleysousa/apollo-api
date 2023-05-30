import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { EmpresaEntity } from './entities/empresa.entity';
import { TerminalModule } from './terminal/terminal.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaEntity]), TerminalModule],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService],
})
export class EmpresaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
