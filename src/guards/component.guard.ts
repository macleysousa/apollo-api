import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';
import { AuthService } from 'src/modules/auth/auth.service';
import { COMPONENT_KEY } from 'src/modules/componente/decorator/componente.decorator';
import { Role } from 'src/modules/usuario/enums/usuario-tipo.enum';
@Injectable()
export class ComponentGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const componentId = this.reflector.getAllAndOverride<string>(COMPONENT_KEY, [context.getHandler(), context.getClass()]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;
    else if (!componentId) return true;

    const { usuario, empresa } = context.switchToHttp().getRequest();

    const isValid = await this.authService.validateComponent(usuario?.id, empresa?.id, componentId);

    if (isValid || usuario?.tipo == Role.sysadmin || usuario?.tipo == Role.administrador) {
      return true;
    }

    throw new UnauthorizedException(`O usuário não tem acesso ao componente ${componentId}`);
  }
}
