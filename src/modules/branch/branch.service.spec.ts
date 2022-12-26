import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { branchFakeRepository } from 'src/base-fake/branch';
import { ILike, Repository } from 'typeorm';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
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
                    useValue: {
                        save: jest.fn().mockResolvedValue(branchFakeRepository.findOne()),
                        find: jest.fn().mockResolvedValue(branchFakeRepository.find()),
                        findOne: jest.fn().mockResolvedValue(branchFakeRepository.findOne()),
                        update: jest.fn().mockResolvedValue(branchFakeRepository.findOne()),
                        delete: jest.fn(),
                    },
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

    describe('create', () => {
        it('should create a branch', async () => {
            // Arrange
            const branch: CreateBranchDto = { id: 1, cnpj: '01.248.473/0001-75', name: 'branch1', fantasyName: 'fantasyName' };

            // Act
            const result = await service.create(branch);

            // Assert
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith(branch);

            expect(result).toEqual(branchFakeRepository.findOne());
        });
    });

    describe('find', () => {
        it('should find branches no use filter', async () => {
            // Arrange
            const filter = '';

            // Act
            const result = await service.find();

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({ where: { cnpj: ILike(`%${filter ?? ''}%`), name: ILike(`%${filter ?? ''}%`) } });

            expect(result).toEqual(branchFakeRepository.find());
        });

        it('should find branches with filter', async () => {
            // Arrange
            const filter = 'filter';

            // Act
            const result = await service.find(filter);

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({ where: { cnpj: ILike(`%${filter ?? ''}%`), name: ILike(`%${filter ?? ''}%`) } });

            expect(result).toEqual(branchFakeRepository.find());
        });
    });

    describe('findById', () => {
        it('should find a branch by id', async () => {
            // Arrange
            const id = 1;

            // Act
            const result = await service.findById(id);

            // Assert
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

            expect(result).toEqual(branchFakeRepository.findOne());
        });
    });

    describe('update', () => {
        it('should update a branch', async () => {
            // Arrange
            const id = 1;
            const branch: CreateBranchDto = { id, cnpj: '01.248.473/0001-75', name: 'branch1', fantasyName: 'fantasyName' };

            // Act
            const result = await service.update(id, branch);

            // Assert
            expect(repository.update).toHaveBeenCalledTimes(1);
            expect(repository.update).toHaveBeenCalledWith(id, branch);

            expect(result).toEqual(branchFakeRepository.findOne());
        });
    });

    describe('remove', () => {
        it('should remove a branch', async () => {
            // Arrange
            const id = 1;

            // Act
            await service.remove(id);

            // Assert
            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith(id);
        });
    });
});
