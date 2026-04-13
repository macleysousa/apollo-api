import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstoqueView } from 'src/modules/estoque/views/estoque.view';

import { CodigoBarrasController } from './codigo-barras.controller';
import { CodigoBarrasService } from './codigo-barras.service';
import { CodigoBarrasEntity } from './entities/codigo-barras.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodigoBarrasEntity, EstoqueView])],
  controllers: [CodigoBarrasController],
  providers: [CodigoBarrasService],
  exports: [CodigoBarrasService],
})
export class CodigoBarraseModule {}
