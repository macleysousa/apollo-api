import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequest } from 'src/decorators/current-user.decorator';
import { Repository } from 'typeorm';

import { CreateGroupAccessDto } from './dto/create-group-access.dto';
import { UserGroupAccessEntity } from './entities/group-access.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserGroupAccessService {
    constructor(
        @Inject(REQUEST) private request: AuthRequest,
        @InjectRepository(UserGroupAccessEntity)
        private repository: Repository<UserGroupAccessEntity>
    ) {}

    async add(userId: number, createGroupAccessDto: CreateGroupAccessDto): Promise<UserGroupAccessEntity> {
        const access = await this.repository.save({ ...createGroupAccessDto, userId, operatorId: this.request.user.id }).catch(() => {
            throw new BadRequestException(`invalid user, branch or group`);
        });
        return this.findByBranchIdAndGroupId(access.userId, access.branchId, access.groupId);
    }

    async find(userId: number, relations = ['group', 'group.items']): Promise<UserGroupAccessEntity[]> {
        return this.repository.find({ where: { userId }, relations });
    }

    async findByBranchId(userId: number, branchId: number, relations = ['group', 'group.items']): Promise<UserGroupAccessEntity[]> {
        return this.repository.find({ where: { userId, branchId }, relations });
    }

    async findByBranchIdAndGroupId(
        userId: number,
        branchId: number,
        groupId: number,
        relations = ['group', 'group.items']
    ): Promise<UserGroupAccessEntity> {
        return this.repository.findOne({ where: { userId, branchId, groupId }, relations });
    }

    async remove(userId: number, branchId: number, groupId: number): Promise<void> {
        await this.repository.delete({ userId, branchId, groupId });
    }
}
