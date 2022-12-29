import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { authFakeRepository } from 'src/base-fake/auth';
import { branchFakeRepository } from 'src/base-fake/branch';
import { userFakeRepository } from 'src/base-fake/user';
import { BranchService } from '../branch/branch.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let userService: UserService;
    let branchService: BranchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue(authFakeRepository.token().token),
                        verifyAsync: jest.fn().mockResolvedValue({}),
                        decode: jest.fn().mockReturnValue({ username: 'username', branchId: 1 }),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        validateUser: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                        findByUserName: jest.fn().mockResolvedValue(userFakeRepository.findOne()),
                        findAccesses: jest.fn().mockResolvedValue(userFakeRepository.findAccesses()),
                    },
                },
                {
                    provide: BranchService,
                    useValue: {
                        findById: jest.fn().mockResolvedValue(branchFakeRepository.findOne()),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userService = module.get<UserService>(UserService);
        branchService = module.get<BranchService>(BranchService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(userService).toBeDefined();
        expect(branchService).toBeDefined();
    });

    describe('login', () => {
        it('should succeed when logging in', async () => {
            // Arrange
            const token = { token: 'token', refreshToken: 'token' };
            const login: LoginDTO = { username: 'username', password: 'password' };
            const user = userFakeRepository.findOne();
            const payload = { id: user.id, username: user.username, name: user.name };

            // Act
            const response = await authService.login(login);

            // Assert
            expect(userService.validateUser).toHaveBeenCalledTimes(1);
            expect(userService.validateUser).toHaveBeenCalledWith(login.username, login.password);
            expect(jwtService.sign).toHaveBeenCalledTimes(2);
            expect(jwtService.sign).toHaveBeenCalledWith(payload);
            expect(response).toEqual(token);
        });

        it('should fail when logging in with error *username or password is invalid*', async () => {
            // Arrange
            const login: LoginDTO = { username: 'username', password: 'password' };
            jest.spyOn(userService, 'validateUser').mockResolvedValueOnce(undefined);

            // Act

            // Assert
            expect(authService.login(login)).rejects.toEqual(new UnauthorizedException('username or password is invalid'));
            expect(userService.validateUser).toHaveBeenCalledTimes(1);
            expect(userService.validateUser).toHaveBeenCalledWith(login.username, login.password);
        });
    });

    describe('validateToken', () => {
        it('should succeed in validating the token', async () => {
            // Arrange
            const token = 'token';
            jest.spyOn(jwtService, 'decode').mockReturnValue({ username: 'username' });

            // Act
            const response = await authService.validateToken(token);

            // Assert
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);

            expect(jwtService.decode).toHaveBeenCalledTimes(2);
            expect(jwtService.decode).toHaveBeenCalledWith(token);

            expect(response).toEqual({ user: userFakeRepository.findOne(), branch: undefined });
        });

        it('should succeed in validating the token with branch id', async () => {
            // Arrange
            const token = 'token';

            // Act
            const response = await authService.validateToken(token);

            // Assert
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);

            expect(jwtService.decode).toHaveBeenCalledTimes(2);
            expect(jwtService.decode).toHaveBeenCalledWith(token);

            expect(response).toEqual({ user: userFakeRepository.findOne(), branch: branchFakeRepository.findOne() });
        });

        it('should fail in validating the token with error *token expired*', async () => {
            // Arrange
            const token = 'token';
            jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce({ name: 'TokenExpiredError' });

            // Act

            // Assert
            expect(authService.validateToken(token)).rejects.toEqual(new UnauthorizedException('token expired'));
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
        });

        it('should fail in validating the token with error *undefined*', async () => {
            // Arrange
            const token = 'token';
            jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce({ name: 'undefined error' });

            // Act

            // Assert
            expect(authService.validateToken(token)).rejects.toEqual(new UnauthorizedException('undefined'));
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
        });
    });

    describe('refreshToken', () => {
        it('should succeed when refresh token in', async () => {
            // Arrange
            const { token } = authFakeRepository.token();
            const refreshToken = 'refreshToken';
            const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
            const user = userFakeRepository.findOne();
            const payload = { id: user.id, username: user.username, name: user.name };
            jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(payload);

            // Act
            const response = await authService.refreshToken(refreshToken);

            // Assert
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, { secret: REFRESH_TOKEN_SECRET });
            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            expect(jwtService.sign).toHaveBeenCalledWith(payload);
            expect(response).toEqual({ token });
        });

        it('should fail when refresh in with error *refresh token invalid*', async () => {
            // Arrange
            const refreshToken = 'refreshToken';
            const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
            jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce({});

            // Act

            // Assert
            expect(authService.refreshToken(refreshToken)).rejects.toEqual(new UnauthorizedException('refresh token invalid'));
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, { secret: REFRESH_TOKEN_SECRET });
        });
    });

    describe('validateComponent', () => {
        it('should succeed in validating the component', async () => {
            // Arrange
            const userId = 1;
            const branchId = 1;
            const componentId = 'ADMFM001';

            // Act
            const response = await authService.validateComponent(userId, branchId, componentId);

            // Assert
            expect(userService.findAccesses).toHaveBeenCalledTimes(1);
            expect(userService.findAccesses).toHaveBeenCalledWith(userId, { branchId, componentId });

            expect(response).toBeTruthy();
        });

        it('should failed in validating the component', async () => {
            // Arrange
            const userId = 1;
            const branchId = 1;
            const componentId = 'ADMFM001';
            jest.spyOn(userService, 'findAccesses').mockResolvedValueOnce(undefined);

            // Act
            const response = await authService.validateComponent(userId, branchId, componentId);

            // Assert
            expect(userService.findAccesses).toHaveBeenCalledTimes(1);
            expect(userService.findAccesses).toHaveBeenCalledWith(userId, { branchId, componentId });

            expect(response).toBeFalsy();
        });
    });
});
