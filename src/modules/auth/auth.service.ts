import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

    async login(login: LoginDTO): Promise<{ token: string; refreshToken: string }> {
        const user = await this.userService.validateUser(login.username, login.password);

        if (user) {
            const payload = { id: user.id, username: user.username, name: user.name };

            const token = this.jwtService.sign(payload);

            const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
            const refreshToken = this.jwtService.sign(payload, { secret: REFRESH_TOKEN_SECRET, expiresIn: '7d' });

            return { token, refreshToken };
        } else {
            throw new UnauthorizedException('username or password is invalid');
        }
    }

    async validateToken(token: string): Promise<UserEntity> {
        await this.jwtService.verifyAsync(token).catch((err) => {
            if (err.name == 'TokenExpiredError') {
                throw new UnauthorizedException('token expired');
            } else {
                throw new UnauthorizedException('undefined');
            }
        });

        const username = this.jwtService.decode(token)['username'];
        return this.userService.findByUserName(username);
    }

    async refreshToken(refreshToken: string): Promise<{ token: string }> {
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

        const { id, username, name } = await this.jwtService.verifyAsync(refreshToken, { secret: REFRESH_TOKEN_SECRET }).catch(() => {
            throw new UnauthorizedException('refresh token invalid');
        });

        return { token: this.jwtService.sign({ id, username, name }) };
    }

    async validateComponent(userId: string, component: string): Promise<unknown> {
        return;
    }
}
