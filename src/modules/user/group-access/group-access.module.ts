import { Module } from '@nestjs/common';
import { GroupAccessService } from './group-access.service';
import { GroupAccessController } from './group-access.controller';

@Module({
  controllers: [GroupAccessController],
  providers: [GroupAccessService]
})
export class GroupAccessModule {}
