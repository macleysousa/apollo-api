import { UserAccessEntity } from 'src/modules/user/entities/user-access.entity';
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

  findAccesses(): UserAccessEntity[] {
    const access = new UserAccessEntity({
      id: 1,
      branchId: 1,
      groupId: 1,
      groupName: 'Administrativo',
      componentId: 'ADMFM001',
      componentName: 'Manutenção de usuário',
      deprecated: false,
    });

    return [access];
  }
}

const userFakeRepository = new UserFakeRepository();
export { userFakeRepository };
