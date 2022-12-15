import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { TokenDTO } from './dto/token.dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

    async login(login: LoginDTO): Promise<TokenDTO> {
        const user = await this.userService.validateUser(login.username, login.password);

        if (user) {
            const payload = { ub: user.id, username: user.username, name: user.name };

            const jwtToken = this.jwtService.sign(payload);

            return { token: jwtToken };
        } else {
            throw new UnauthorizedException('username or password is invalid');
        }
    }

    async validateToken(token: string): Promise<UserEntity> {
        await this.jwtService.verifyAsync(token).catch(err => {
            if (err.name == 'TokenExpiredError') {
                throw new UnauthorizedException('token expired');
            } else {
                throw new UnauthorizedException('undefined');
            }
        });

        const username = this.jwtService.decode(token)['username'];
        return this.userService.findByUserName(username);
    }
}
