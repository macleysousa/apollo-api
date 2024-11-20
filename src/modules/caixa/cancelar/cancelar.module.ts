import { Module } from '@nestjs/common';

import { CancelarController } from './cancelar.controller';
import { CancelarService } from './cancelar.service';

@Module({
  controllers: [CancelarController],
  providers: [CancelarService],
})
export class CancelarModule {}
