import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';

import { PESSOA_KEY } from 'src/decorators/api-pessoa.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';
import { PessoaUsuarioService } from 'src/modules/pessoa-usuario/pessoa-usuario.service';

@Injectable()
export class PessoaGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private pessoaService: PessoaUsuarioService,
  ) {}

  private getTokenFromRequest(request: Request): string {
    const authHeader = Object.keys(request.headers).find((h) => h.toLowerCase() === 'authorization');

    if (!authHeader) {
      throw new UnauthorizedException('Token is not present');
    }

    const authorization = request.headers[authHeader] as string;

    const authParts = authorization.split(' ');
    if (authParts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid token');
    }

    return authParts[1] as string;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pessoaKey = this.reflector.getAllAndOverride<string>(PESSOA_KEY, [context.getHandler(), context.getClass()]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;
    else if (!pessoaKey) return true;

    const token = this.getTokenFromRequest(request);
    if (!token) throw new UnauthorizedException('Token invalido ou não informado');

    const usuario = await this.pessoaService.validateToken(token);
    if (!usuario) throw new UnauthorizedException('Token invalido');

    request.token = token;
    request.pessoa = instanceToPlain(usuario);

    return true;
  }
}
