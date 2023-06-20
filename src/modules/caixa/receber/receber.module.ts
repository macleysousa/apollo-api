import { Module } from '@nestjs/common';

import { ReceberService } from './receber.service';
import { ReceberController } from './receber.controller';
import { ExtratoModule } from '../extrato/extrato.module';

@Module({
  imports: [ExtratoModule],
  controllers: [ReceberController],
  providers: [ReceberService],
})
export class ReceberModule {}
