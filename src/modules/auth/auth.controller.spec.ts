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
          useValue: {
            login: jest.fn().mockResolvedValue(authFakeRepository.token()),
            refreshToken: jest.fn().mockResolvedValue({ token: authFakeRepository.token().token }),
          },
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

  describe('/signIn (POST)', () => {
    it('should succeed when logging in', async () => {
      // Arrange
      const login: LoginDTO = { username: 'username', password: 'password' };
      const response = { cookie: jest.fn(), send: jest.fn() };
      const { token, refreshToken } = authFakeRepository.token();

      // Act
      await authController.login(login, response);

      // Assert
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(login);

      expect(response.cookie).toHaveBeenCalledTimes(1);
      expect(response.cookie).toHaveBeenCalledWith('refreshToken', refreshToken, { httpOnly: true });

      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith({ token });
    });
  });

  describe('/refresh (POST)', () => {
    it('should successfully return a new token', async () => {
      // Arrange
      const { token, refreshToken } = authFakeRepository.token();

      // Act
      const response = await authController.refreshToken({ refreshToken });

      // Assert
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);

      expect(response).toEqual({ token });
    });
  });
});
