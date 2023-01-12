import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchService } from '../branch/branch.service';
import { BranchEntity } from '../branch/entities/branch.entity';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService, private branchService: BranchService) {}

  async login({ username, password, branchId }: LoginDTO): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userService.validateUser(username, password);

    if (user) {
      const payload = { id: user.id, username: user.username, name: user.name, branchId };

      const token = this.jwtService.sign(payload);

      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
      const refreshToken = this.jwtService.sign(payload, { secret: REFRESH_TOKEN_SECRET, expiresIn: '7d' });

      return { token, refreshToken };
    } else {
      throw new UnauthorizedException('username or password is invalid');
    }
  }

  async validateToken(token: string): Promise<{ user: UserEntity; branch?: BranchEntity }> {
    await this.jwtService.verifyAsync(token).catch((err) => {
      if (err.name == 'TokenExpiredError') {
        throw new UnauthorizedException('token expired');
      } else {
        throw new UnauthorizedException('undefined');
      }
    });

    const username = this.jwtService.decode(token)['username'];
    const user = await this.userService.findByUserName(username);

    const branchId = this.jwtService.decode(token)['branchId'];
    const branch = branchId ? await this.branchService.findById(branchId) : undefined;

    return { user, branch };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    const { id, username, name, branchId } = await this.jwtService.verifyAsync(refreshToken, { secret: REFRESH_TOKEN_SECRET }).catch(() => {
      throw new UnauthorizedException('refresh token invalid');
    });

    return { token: this.jwtService.sign({ id, username, name, branchId }) };
  }

  async validateComponent(userId: number, branchId: number, componentId: string): Promise<boolean> {
    const accesses = await this.userService.findAccesses(userId, { branchId, componentId });
    const access = accesses?.find((access) => access.componentId == componentId);

    if (access?.deprecated) {
      throw new UnauthorizedException(`component ${componentId} is deprecated`);
    }

    return access ? true : false;
  }
}
