import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { instanceToPlain } from 'class-transformer';

import { PESSOA_KEY } from 'src/decorators/api-pessoa.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';
import { TenantRequest } from 'src/index';

import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  private getTokenFromRequest(request: TenantRequest, required = true): string | undefined {
    const authHeader = Object.keys(request.headers).find((h) => h.toLowerCase() === 'authorization');

    if (!authHeader) {
      if (required) {
        throw new UnauthorizedException('Token is not present');
      }

      return undefined;
    }

    const authorization = request.headers[authHeader] as string;

    const authParts = authorization.split(' ');
    if (authParts[0].toLowerCase() !== 'bearer' || !authParts[1]) {
      if (required) {
        throw new UnauthorizedException('Invalid token');
      }

      return undefined;
    }

    return authParts[1] as string;
  }

  private async attachAuthToRequest(request: TenantRequest, token: string): Promise<void> {
    const { usuario, empresa } = await this.authService.validateToken(token);
    if (!usuario) {
      throw new UnauthorizedException('Invalid token');
    }

    request.usuario = instanceToPlain(usuario) as any;
    request.empresa = instanceToPlain(empresa) as any;
    request.parametros = instanceToPlain(empresa?.parametros) as any;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    const isPessoaKey = this.reflector.getAllAndOverride<string>(PESSOA_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      const token = this.getTokenFromRequest(request, false);

      if (token) {
        try {
          await this.attachAuthToRequest(request, token);
        } catch {
          // ignore invalid token on public routes and continue as anonymous
        }
      }

      return true;
    }

    if (isPessoaKey) return true;

    const token = this.getTokenFromRequest(request);
    if (!token) throw new UnauthorizedException('Invalid or not provided auth token');

    await this.attachAuthToRequest(request, token);

    return true;
  }
}
