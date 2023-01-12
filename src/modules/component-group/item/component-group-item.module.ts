import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentGroupItemController } from './component-group-item.controller';

import { ComponentGroupItemService } from './component-group-item.service';
import { ComponentGroupItemEntity } from './entities/component-group-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentGroupItemEntity])],
  controllers: [ComponentGroupItemController],
  providers: [ComponentGroupItemService],
})
export class ComponentGroupItemModule {}
