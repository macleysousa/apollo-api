import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentGroupController } from './component-group.controller';
import { ComponentGroupService } from './component-group.service';
import { ComponentGroupItemEntity } from './entities/component-group-item.entity';
import { ComponentGroupEntity } from './entities/component-group.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ComponentGroupEntity, ComponentGroupItemEntity])],
    controllers: [ComponentGroupController],
    providers: [ComponentGroupService],
})
export class ComponentGroupModule {}
