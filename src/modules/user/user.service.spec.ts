import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userFakeRepository } from 'src/base-fake/user';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Role } from './enum/user-role.enum';
import { UserStatus } from './enum/user-status';
import { UserService } from './user.service';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(userFakeRepository.find()),
                        findOne: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                        save: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                        createQueryBuilder: jest.fn().mockReturnValue({
                            where: jest.fn(),
                            andWhere: jest.fn(),
                            getMany: jest.fn().mockResolvedValue(userFakeRepository.find()),
                        }),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe('create', () => {
        it('should create a User Entity with successful', async () => {
            // Arrange
            const createUserDto: CreateUserDto = {
                username: 'username',
                password: 'password',
                name: 'name',
                role: Role.DEFAULT,
                status: UserStatus.RELEASED,
            };

            // Act
            const response = await userService.create(createUserDto);

            // Assert
            expect(userRepository.save).toHaveBeenCalledTimes(1);
            expect(userRepository.save).toHaveBeenCalledWith({ ...createUserDto });
            expect(response).toEqual(userFakeRepository.findOne());
        });
    });

    describe('find', () => {
        it('should return a list User Entity with successful', async () => {
            // Arrange
            const name = 'name generic';

            // Act
            const response = await userService.find(name);

            // Assert
            expect(userRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
            expect(userRepository.createQueryBuilder().where).toHaveBeenCalledTimes(1);
            expect(userRepository.createQueryBuilder().where).toHaveBeenCalledWith({ id: Not(IsNull()) });
            expect(userRepository.createQueryBuilder().andWhere).toHaveBeenCalledTimes(1);
            expect(userRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith({ name: ILike(`%${name}%`) });
            expect(response).toEqual(userFakeRepository.find());
        });
    });

    describe('findById', () => {
        it('should return a User Entity with successful by id', async () => {
            // Arrange
            const userId = 1;

            // Act
            const response = await userService.findById(userId);

            // Assert
            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
            expect(response).toEqual(userFakeRepository.findOne());
        });
    });

    describe('findByUserName', () => {
        it('should return a User Entity with successful by username', async () => {
            // Arrange
            const username = 'username';

            // Act
            const response = await userService.findByUserName(username);

            // Assert
            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username } });
            expect(response).toEqual(userFakeRepository.findOne());
        });
    });

    describe('update', () => {
        it('should update a User Entity with successful', async () => {
            // Arrange
            const userId = 1;
            const updateUserDto: UpdateUserDto = { password: 'password', name: 'name', role: Role.DEFAULT, status: UserStatus.BLOCKED };

            // Act
            const response = await userService.update(userId, updateUserDto);

            // Assert
            expect(userRepository.save).toHaveBeenCalledTimes(1);
            expect(userRepository.save).toHaveBeenCalledWith({ ...userFakeRepository.findOne(), ...updateUserDto });
            expect(response).toEqual({ ...userFakeRepository.findOne(), ...updateUserDto });
        });
    });

    describe('validateUser', () => {
        it('should return an error when validating the user *username or password invalid*', async () => {
            // Arrange
            const username = 'username';
            const password = '';

            // Act

            // Assert
            expect(userService.validateUser(username, password)).rejects.toEqual(new UnauthorizedException('username or password invalid'));
            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username } });
        });

        it('should return a successful when validating the user', async () => {
            // Arrange
            const username = 'username';
            const password = 'password';

            // Act
            const response = await userService.validateUser(username, password);

            // Assert
            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username } });
            expect(response).toEqual(userFakeRepository.findOne());
        });
    });
});
