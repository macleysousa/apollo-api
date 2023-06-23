import { Module } from '@nestjs/common';
import { CancelarService } from './cancelar.service';
import { CancelarController } from './cancelar.controller';

@Module({
  controllers: [CancelarController],
  providers: [CancelarService]
})
export class CancelarModule {}
