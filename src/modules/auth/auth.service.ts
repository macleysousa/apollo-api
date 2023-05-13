import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BranchService } from '../branch/branch.service';
import { BranchEntity } from '../branch/entities/branch.entity';

import { LoginDTO } from './dto/login.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioEntity } from '../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UsuarioService, private branchService: BranchService) {}

  async login({ usuario, senha, empresaId }: LoginDTO): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userService.validateUser(usuario, senha);

    if (user) {
      const payload = { id: user.id, usuario: user.usuario, nome: user.nome, empresaId };

      const token = this.jwtService.sign(payload);

      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
      const refreshToken = this.jwtService.sign(payload, { secret: REFRESH_TOKEN_SECRET, expiresIn: '7d' });

      return { token, refreshToken };
    } else {
      throw new UnauthorizedException('username or password is invalid');
    }
  }

  async validateToken(token: string): Promise<{ user: UsuarioEntity; branch?: BranchEntity }> {
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

    const { id, usuario, nome, empresaId } = await this.jwtService.verifyAsync(refreshToken, { secret: REFRESH_TOKEN_SECRET }).catch(() => {
      throw new UnauthorizedException('refresh token invalid');
    });

    return { token: this.jwtService.sign({ id, usuario, nome, empresaId }) };
  }

  async validateComponent(userId: number, empresaId: number, componenteId: string): Promise<boolean> {
    const accesses = await this.userService.findAccesses(userId, { empresaId, componenteId });
    const access = accesses?.find((access) => access.componenteId == componenteId);

    if (access?.descontinuado) {
      throw new UnauthorizedException(`o componente ${componenteId} foi descontinuado`);
    }

    return access ? true : false;
  }
}
