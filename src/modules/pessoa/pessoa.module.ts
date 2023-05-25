import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';
import { IsDocumentoConstraint } from './validation/is-documento-unique.validation';
import { PessoaEntity } from './entities/pessoa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaEntity])],
  controllers: [PessoaController],
  providers: [PessoaService, IsDocumentoConstraint],
  exports: [PessoaService],
})
export class PessoaModule {}
