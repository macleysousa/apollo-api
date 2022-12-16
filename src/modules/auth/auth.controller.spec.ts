import { Test, TestingModule } from '@nestjs/testing';
import { authFakeRepository } from 'src/base-fake/auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: { login: jest.fn().mockResolvedValue(authFakeRepository.token()) },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
        expect(authService).toBeDefined();
    });

    describe('login', () => {
        it('should succeed when logging in', async () => {
            // Arrange
            const login: LoginDTO = { username: 'username', password: 'password' };

            // Act
            const response = await authController.login(login);

            // Assert
            expect(authService.login).toHaveBeenCalledTimes(1);
            expect(authService.login).toHaveBeenCalledWith(login);
            expect(response).toEqual(authFakeRepository.token());
        });
    });
});
