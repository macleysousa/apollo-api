import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';
import { EstoqueEntity } from './entities/estoque.entity';
import { EstoqueView } from './views/estoque.view';

@Module({
  imports: [TypeOrmModule.forFeature([EstoqueEntity, EstoqueView])],
  controllers: [EstoqueController],
  providers: [EstoqueService],
})
export class EstoqueModule {}
