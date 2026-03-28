import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EcommerceReferenciaController } from './ecommerce-referencia.controller';
import { EcommerceReferenciaService } from './ecommerce-referencia.service';
import { EcommerceReferenciaEntity } from './entities/ecommerce-referencia.entity';
import { EcommerceReferenciaView } from './view/ecommerce-referencia.view';

@Module({
  imports: [TypeOrmModule.forFeature([EcommerceReferenciaEntity, EcommerceReferenciaView])],
  controllers: [EcommerceReferenciaController],
  providers: [EcommerceReferenciaService],
})
export class EcommerceReferenciaModule {}
