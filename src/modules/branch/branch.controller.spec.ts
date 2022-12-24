import { Test, TestingModule } from '@nestjs/testing';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

describe('BranchController', () => {
    let controller: BranchController;
    let service: BranchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BranchController],
            providers: [
                {
                    provide: BranchService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<BranchController>(BranchController);
        service = module.get<BranchService>(BranchService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
