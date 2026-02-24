import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalancoModule } from '../balanco.module';

import { BalancoLoteController } from './balanco-lote.controller';
import { BalancoLoteService } from './balanco-lote.service';
import { BalancoLoteEntity } from './entities/balanco-lote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BalancoLoteEntity]), forwardRef(() => BalancoModule)],
  controllers: [BalancoLoteController],
  providers: [BalancoLoteService],
  exports: [BalancoLoteService],
})
export class BalancoLoteModule {}
