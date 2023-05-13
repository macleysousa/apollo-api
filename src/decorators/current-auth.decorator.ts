import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BranchEntity } from 'src/modules/branch/entities/branch.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

export interface AuthRequest extends Request {
  user: UsuarioEntity;
  branch?: BranchEntity;
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): UsuarioEntity => {
  const request = context.switchToHttp().getRequest<AuthRequest>();

  return request.user;
});

export const CurrentBranch = createParamDecorator((data: unknown, context: ExecutionContext): BranchEntity => {
  const request = context.switchToHttp().getRequest<AuthRequest>();

  return request.branch;
});
