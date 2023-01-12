import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentGroupController } from './component-group.controller';
import { ComponentGroupService } from './component-group.service';
import { ComponentGroupEntity } from './entities/component-group.entity';
import { ComponentGroupItemModule } from './item/component-group-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentGroupEntity]), ComponentGroupItemModule],
  controllers: [ComponentGroupController],
  providers: [ComponentGroupService],
})
export class ComponentGroupModule {}
