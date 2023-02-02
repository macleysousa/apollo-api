import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubCategoryService } from './sub.service';
import { SubCategoryController } from './sub.controller';
import { SubCategoryEntity } from './entities/sub.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryEntity])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
