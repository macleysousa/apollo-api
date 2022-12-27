import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserGroupAccessEntity } from './entities/group-access.entity';
import { GroupAccessController } from './group-access.controller';
import { UserGroupAccessService } from './group-access.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserGroupAccessEntity])],
    controllers: [GroupAccessController],
    providers: [UserGroupAccessService],
})
export class GroupAccessModule {}
