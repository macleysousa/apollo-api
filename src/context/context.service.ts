import { Injectable } from '@nestjs/common';
import { RequestContext } from 'nestjs-request-context';

import { AuthRequest } from 'src/decorators/current-auth.decorator';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

@Injectable()
export class ContextService {
  currentAuth(): AuthRequest {
    return RequestContext.currentContext.req as unknown as AuthRequest;
  }

  currentUser(): UsuarioEntity {
    return RequestContext.currentContext.req['usuario'];
  }

  currentBranch(): EmpresaEntity {
    return RequestContext.currentContext.req['empresa'];
  }

  request(): Request {
    return RequestContext.currentContext.req as unknown as Request;
  }
  response(): Response {
    return RequestContext.currentContext.res as unknown as Response;
  }
}
