import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/modules/usuario/roles.decorator';
import { Role } from 'src/modules/usuario/enums/usuario-tipo.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (requiredRoles.includes(user.tipo)) {
      return true;
    } else {
      throw new UnauthorizedException(`${user.tipo} is not authorized to access this route`);
    }
  }
}
