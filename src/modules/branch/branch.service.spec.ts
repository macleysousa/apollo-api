import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchService } from './branch.service';
import { BranchEntity } from './entities/branch.entity';

describe('BranchService', () => {
    let service: BranchService;
    let repository: Repository<BranchEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BranchService,
                {
                    provide: getRepositoryToken(BranchEntity),
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<BranchService>(BranchService);
        repository = module.get<Repository<BranchEntity>>(getRepositoryToken(BranchEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });
});
