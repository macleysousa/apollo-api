import { UserGroupAccessEntity } from 'src/modules/user/group-access/entities/group-access.entity';

class UserGroupAccessFakeRepository {
    find(): UserGroupAccessEntity[] {
        const access = new UserGroupAccessEntity({
            userId: 1,
            branchId: 1,
            groupId: 1,
            operatorId: 1,
            createdAt: new Date('2022-10-15T11:13:18.000Z'),
            updatedAt: new Date('2022-10-15T11:13:18.000Z'),
        });
        return [access];
    }

    findOne(): UserGroupAccessEntity {
        const access = new UserGroupAccessEntity({
            userId: 1,
            branchId: 1,
            groupId: 1,
            operatorId: 1,
            createdAt: new Date('2022-10-15T11:13:18.000Z'),
            updatedAt: new Date('2022-10-15T11:13:18.000Z'),
        });
        return access;
    }
}
const userGroupAccessFakeRepository = new UserGroupAccessFakeRepository();
export { userGroupAccessFakeRepository };
