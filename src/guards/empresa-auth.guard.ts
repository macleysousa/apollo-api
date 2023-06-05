import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { EMPRESA_KEY } from 'src/decorators/api-empresa-auth.decorator';
import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';

@Injectable()
export class EmpresaAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const empresaKey = this.reflector.getAllAndOverride<string>(EMPRESA_KEY, [context.getHandler(), context.getClass()]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;
    else if (!empresaKey) return true;

    const { empresa } = context.switchToHttp().getRequest();

    if (!empresa) throw new UnauthorizedException(`Empresa não informada no login`);

    return true;
  }
}
