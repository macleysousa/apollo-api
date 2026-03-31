import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EcommerceController } from './ecommerce.controller';
import { EcommerceService } from './ecommerce.service';
import { EcommerceCatalogoModule } from './ecommerce-catalogo/ecommerce-catalogo.module';
import { EcommerceReferenciaModule } from './ecommerce-referencia/ecommerce-referencia.module';
import { EcommerceEntity } from './entities/ecommerce.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EcommerceEntity]), EcommerceReferenciaModule.forRoot(), EcommerceCatalogoModule],
  controllers: [EcommerceController],
  providers: [EcommerceService],
})
export class EcommerceModule {}
