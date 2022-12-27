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
                        remove: jest.fn(),
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
            const group: CreateGroupAccessDto = { userId: 1, branchId: 1, groupId: 1 };

            // Act
            const result = await service.create(group);

            // Assert
            expect(repository.save).toHaveBeenCalledTimes(1);
            expect(repository.save).toHaveBeenCalledWith({ ...group, operatorId: request.user.id });

            expect(result).toEqual(userGroupAccessFakeRepository.findOne());
        });

        it('should throw error when create a group access', async () => {
            // Arrange
            const group: CreateGroupAccessDto = { userId: 1, branchId: 1, groupId: 1 };
            repository.save = jest.fn().mockRejectedValue(new Error());

            // Act

            // Assert
            expect(service.create(group)).rejects.toEqual(new BadRequestException(`invalid user, branch or group`));
        });
    });
});
