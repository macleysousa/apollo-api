import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from 'src/modules/usuario/enums/usuario-tipo.enum';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    const { usuario } = context.switchToHttp().getRequest();

    if (requiredRoles.includes(usuario.tipo)) {
      return true;
    } else {
      throw new UnauthorizedException(`O usuário não tem acesso a essa funcionalidade`);
    }
  }
}
