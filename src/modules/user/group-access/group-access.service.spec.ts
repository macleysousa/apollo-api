import { BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userFakeRepository } from 'src/base-fake/user';
import { userGroupAccessFakeRepository } from 'src/base-fake/user-group-access';
import { AuthRequest } from 'src/decorators/current-user.decorator';
import { Repository } from 'typeorm';
import { CreateGroupAccessDto } from './dto/create-group-access.dto';
import { UserGroupAccessEntity } from './entities/group-access.entity';
import { UserGroupAccessService } from './group-access.service';

describe('GroupAccessService', () => {
    let service: UserGroupAccessService;
    let request: AuthRequest;
    let repository: Repository<UserGroupAccessEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserGroupAccessService,
                {
                    provide: REQUEST,
                    useValue: {
                        user: userFakeRepository.findOne(),
                    },
                },
                {
                    provide: getRepositoryToken(UserGroupAccessEntity),
                    useValue: {
                        save: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.findOne()),
                        find: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.find()),
                        findOne: jest.fn().mockResolvedValue(userGroupAccessFakeRepository.findOne()),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = await module.resolve<UserGroupAccessService>(UserGroupAccessService);
        request = await module.resolve<AuthRequest>(REQUEST);
        repository = module.get<Repository<UserGroupAccessEntity>>(getRepositoryToken(UserGroupAccessEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(request).toBeDefined();
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a group access', async () => {
            // Arrange
            const userId = 1;
            const operatorId = request.user.id;
            const group: CreateGroupAccessDto = { branchId: 1, groupId: 1 };

            // Act
            const result = await service.add(userId, group);

            // Assert
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({ ...group, userId, operatorId });

            expect(result).toEqual(userGroupAccessFakeRepository.findOne());
        });

        it('should throw error when create a group access', async () => {
            // Arrange
            const userId = 1;
            const group: CreateGroupAccessDto = { branchId: 1, groupId: 1 };
            repository.save = jest.fn().mockRejectedValue(new Error());

            // Act

            // Assert
            expect(service.add(userId, group)).rejects.toEqual(new BadRequestException(`invalid user, branch or group`));
        });
    });

    describe('find', () => {
        it('should find group access', async () => {
            // Arrange
            const userId = 1;
            const relations = ['group', 'group.items'];

            // Act
            const result = await service.find(userId);

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({ where: { userId }, relations });

            expect(result).toEqual(userGroupAccessFakeRepository.find());
        });
    });

    describe('findByBranchId', () => {
        it('should find groups access by branch id', async () => {
            // Arrange
            const userId = 1;
            const branchId = 1;
            const relations = ['group', 'group.items'];

            // Act
            const result = await service.findByBranchId(userId, branchId);

            // Assert
            expect(repository.find).toHaveBeenCalledTimes(1);
            expect(repository.find).toHaveBeenCalledWith({ where: { userId, branchId }, relations });

            expect(result).toEqual(userGroupAccessFakeRepository.find());
        });
    });

    describe('findByBranchIdAndGroupId', () => {
        it('should find groups access by branch id and group id', async () => {
            // Arrange
            const userId = 1;
            const branchId = 1;
            const groupId = 1;
            const relations = ['group', 'group.items'];

            // Act
            const result = await service.findByBranchIdAndGroupId(userId, branchId, groupId);

            // Assert
            expect(repository.findOne).toHaveBeenCalledTimes(1);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { userId, branchId, groupId }, relations });

            expect(result).toEqual(userGroupAccessFakeRepository.findOne());
        });
    });

    describe('remove', () => {
        it('should remove group access', async () => {
            // Arrange
            const userId = 1;
            const branchId = 1;
            const groupId = 1;

            // Act
            await service.remove(userId, branchId, groupId);

            // Assert
            expect(repository.delete).toHaveBeenCalledTimes(1);
            expect(repository.delete).toHaveBeenCalledWith({ userId, branchId, groupId });
        });
    });
});
