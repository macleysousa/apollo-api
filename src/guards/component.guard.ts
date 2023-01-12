import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/modules/auth/auth.service';
import { COMPONENT_KEY } from 'src/modules/component/component.decorator';
import { Role } from 'src/modules/user/enum/user-role.enum';

@Injectable()
export class ComponentGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const componentId = this.reflector.getAllAndOverride<string>(COMPONENT_KEY, [context.getHandler(), context.getClass()]);

    if (!componentId) return true;

    const { user, branch } = context.switchToHttp().getRequest();

    const isValid = await this.authService.validateComponent(user?.id, branch?.id, componentId);

    if (isValid || user?.role == Role.SYSADMIN || user.role == Role.ADMIN) {
      return true;
    }

    throw new UnauthorizedException(`User does not have access to component ${componentId}`);
  }
}
