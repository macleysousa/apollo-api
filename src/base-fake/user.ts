import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enum/user-role.enum';
import { UserStatus } from 'src/modules/user/enum/user-status';

class UserFakeRepository {
    find(): UserEntity[] {
        const user = new UserEntity();
        user.id = 1;
        user.username = 'username';
        user.password = 'password';
        user.name = 'john doe';
        user.role = Role.ADMIN;
        user.status = UserStatus.RELEASED;
        user.createdAt = new Date('2022-10-15T11:13:18.000Z');
        user.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return [user];
    }

    findOne(): UserEntity {
        const user = new UserEntity();
        user.id = 1;
        user.username = 'username';
        user.password = 'password';
        user.name = 'john doe';
        user.role = Role.ADMIN;
        user.status = UserStatus.RELEASED;
        user.createdAt = new Date('2022-10-15T11:13:18.000Z');
        user.updatedAt = new Date('2022-10-15T11:13:18.000Z');
        return user;
    }
}

const userFakeRepository = new UserFakeRepository();
export { userFakeRepository };
