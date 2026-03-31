import { Module } from '@nestjs/common';

import { EcommerceCatalogoController } from './ecommerce-catalogo.controller';
import { EcommerceCatalogoService } from './ecommerce-catalogo.service';

@Module({
  controllers: [EcommerceCatalogoController],
  providers: [EcommerceCatalogoService],
})
export class EcommerceCatalogoModule {}
