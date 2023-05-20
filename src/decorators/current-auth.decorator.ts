import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

export interface AuthRequest extends Request {
  user: UsuarioEntity;
  branch?: EmpresaEntity;
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): UsuarioEntity => {
  const request = context.switchToHttp().getRequest<AuthRequest>();

  return request.user;
});

export const CurrentBranch = createParamDecorator((data: unknown, context: ExecutionContext): EmpresaEntity => {
  const request = context.switchToHttp().getRequest<AuthRequest>();

  return request.branch;
});
