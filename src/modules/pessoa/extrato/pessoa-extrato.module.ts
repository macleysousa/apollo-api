import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PessoaExtratoService } from './pessoa-extrato.service';
import { PessoaExtratoController } from './pessoa-extrato.controller';
import { PessoaExtratoEntity } from './entities/pessoa-extrato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaExtratoEntity])],
  controllers: [PessoaExtratoController],
  providers: [PessoaExtratoService],
})
export class PessoaExtratoModule {}
