import { Module } from '@nestjs/common';

import { ExtratoModule } from '../extrato/extrato.module';

import { ReceberController } from './receber.controller';
import { ReceberService } from './receber.service';

@Module({
  imports: [ExtratoModule],
  controllers: [ReceberController],
  providers: [ReceberService],
})
export class ReceberModule {}
