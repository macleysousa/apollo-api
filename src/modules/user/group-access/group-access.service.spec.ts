import { Test, TestingModule } from '@nestjs/testing';
import { GroupAccessService } from './group-access.service';

describe('GroupAccessService', () => {
  let service: GroupAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupAccessService],
    }).compile();

    service = module.get<GroupAccessService>(GroupAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
