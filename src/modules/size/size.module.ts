import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeEntity } from './entities/size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SizeEntity])],
  controllers: [SizeController],
  providers: [SizeService],
  exports: [SizeService],
})
export class SizeModule {}
