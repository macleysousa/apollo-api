import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';
import { EstoqueEntity } from './entities/estoque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstoqueEntity])],
  controllers: [EstoqueController],
  providers: [EstoqueService],
})
export class EstoqueModule {}
