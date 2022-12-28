import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { userFakeRepository } from 'src/base-fake/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enum/user-role.enum';
import { UserStatus } from './enum/user-status';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                        find: jest.fn().mockResolvedValue(userFakeRepository.find()),
                        findById: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                        findAccesses: jest.fn().mockResolvedValue(userFakeRepository.findAccesses()),
                        update: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
        expect(userService).toBeDefined();
    });

    describe('/ (POST)', () => {
        it('should create a User Entity with failed *To create sysadmin user you must have sysadmin access*', async () => {
            // Arrange
            const user = userFakeRepository.findOne();
            const createUserDto: CreateUserDto = {
                username: 'username',
                password: 'password',
                name: 'name',
                role: Role.SYSADMIN,
                status: UserStatus.RELEASED,
            };

            // Act

            // Assert

            expect(userController.create(user, createUserDto)).rejects.toEqual(
                new UnauthorizedException('To create sysadmin user you must have sysadmin access')
            );
        });

        it('should create a User Entity with successful', async () => {
            // Arrange
            const user = userFakeRepository.findOne();
            const createUserDto: CreateUserDto = {
                username: 'username',
                password: 'password',
                name: 'name',
                role: Role.DEFAULT,
                status: UserStatus.RELEASED,
            };

            // Act
            const response = await userController.create(user, createUserDto);

            // Assert
            expect(userService.create).toHaveBeenCalledTimes(1);
            expect(userService.create).toHaveBeenCalledWith({ ...createUserDto });
            expect(response).toEqual(userFakeRepository.findOne());
        });
    });

    describe('/ (GET)', () => {
        it('should return a list User Entity with successful', async () => {
            // Arrange
            const name = 'name generic';

            // Act
            const response = await userController.find(name);

            // Assert
            expect(userService.find).toHaveBeenCalledTimes(1);
            expect(userService.find).toHaveBeenCalledWith(name);
            expect(response).toEqual(userFakeRepository.find());
        });
    });

    describe('/:id (GET)', () => {
        it('should return a User Entity with successful by id', async () => {
            // Arrange
            const userId = 1;

            // Act
            const response = await userController.findById(userId);

            // Assert
            expect(userService.findById).toHaveBeenCalledTimes(1);
            expect(userService.findById).toHaveBeenCalledWith(userId);
            expect(response).toEqual(userFakeRepository.findOne());
        });
    });

    describe('/:id/accesses (GET)', () => {
        it('should return a list Accesses User Entity with successful by id with filter', async () => {
            // Arrange
            const id = 1;
            const branchId = '1';
            const componentId = 'ADMFM001';

            // Act
            const response = await userController.findAccesses(id, branchId, componentId);

            // Assert
            expect(userService.findAccesses).toHaveBeenCalledTimes(1);
            expect(userService.findAccesses).toHaveBeenCalledWith(id, { branchId: +branchId ? +branchId : null, componentId });
            expect(response).toEqual(userFakeRepository.findAccesses());
        });

        it('should return a list Accesses User Entity with successful by id no filter', async () => {
            // Arrange
            const id = 1;
            const branchId = undefined;
            const componentId = undefined;

            // Act
            const response = await userController.findAccesses(id, branchId, componentId);

            // Assert
            expect(userService.findAccesses).toHaveBeenCalledTimes(1);
            expect(userService.findAccesses).toHaveBeenCalledWith(id, { branchId: +branchId ? +branchId : null, componentId });
            expect(response).toEqual(userFakeRepository.findAccesses());
        });
    });

    describe('/:id (PUT)', () => {
        it('should update a User Entity with failed *To update user to sysadmin you must have sysadmin access*', async () => {
            // Arrange
            const user = userFakeRepository.findOne();
            const userId = 1;
            const updateUserDto: UpdateUserDto = { password: 'password', name: 'name', role: Role.SYSADMIN, status: UserStatus.BLOCKED };

            // Act

            // Assert
            expect(userController.update(user, userId, updateUserDto)).rejects.toEqual(
                new UnauthorizedException('To update user to sysadmin you must have sysadmin access')
            );
        });

        it('should update a User Entity with successful', async () => {
            // Arrange
            const user = userFakeRepository.findOne();
            const userId = 1;
            const updateUserDto: UpdateUserDto = { password: 'password', name: 'name', role: Role.DEFAULT, status: UserStatus.BLOCKED };

            // Act
            const response = await userController.update(user, userId, updateUserDto);

            // Assert
            expect(userService.update).toHaveBeenCalledTimes(1);
            expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
            expect(response).toEqual({ ...userFakeRepository.findOne() });
        });
    });
});
