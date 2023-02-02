import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { ColorEntity } from './entities/color.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColorEntity])],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
})
export class ColorModule {}
