import { Test, TestingModule } from '@nestjs/testing';
import { GroupAccessController } from './group-access.controller';
import { UserGroupAccessService } from './group-access.service';

describe('GroupAccessController', () => {
  let controller: GroupAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupAccessController],
      providers: [UserGroupAccessService],
    }).compile();

    controller = module.get<GroupAccessController>(GroupAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
