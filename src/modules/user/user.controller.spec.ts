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
                UserService,
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                        find: jest.fn().mockResolvedValue(userFakeRepository.find()),
                        findById: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
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

    describe('create', () => {
        it('should create a User Entity with successful', async () => {
            // Arrange
            const createUserDto: CreateUserDto = { username: 'username', password: 'password', name: 'name', role: Role.DEFAULT };

            // Act
            const response = await userController.create(createUserDto);

            // Assert
            expect(userService.create).toHaveBeenCalledTimes(1);
            expect(userService.create).toHaveBeenCalledWith({ ...createUserDto });
            expect(response).toEqual(userFakeRepository.findOne());
        });
    });

    describe('find', () => {
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

    describe('findById', () => {
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

    describe('update', () => {
        it('should update a User Entity with successful', async () => {
            // Arrange
            const userId = 1;
            const updateUserDto: UpdateUserDto = { password: 'password', name: 'name', role: Role.DEFAULT, status: UserStatus.BLOCKED };

            // Act
            const response = await userController.update(userId, updateUserDto);

            // Assert
            expect(userService.update).toHaveBeenCalledTimes(1);
            expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
            expect(response).toEqual({ ...userFakeRepository.findOne() });
        });
    });
});
