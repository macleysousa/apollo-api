import { Module } from '@nestjs/common';

import { EcommerceController } from './ecommerce.controller';
import { EcommerceService } from './ecommerce.service';
import { EcommerceReferenciaModule } from './ecommerce-referencia/ecommerce-referencia.module';

@Module({
  controllers: [EcommerceController],
  providers: [EcommerceService],
  imports: [EcommerceReferenciaModule],
})
export class EcommerceModule {}
