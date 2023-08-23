import { Injectable } from '@nestjs/common';
import { RequestContext } from 'nestjs-easy-context';

import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { EmpresaParametroEntity } from 'src/modules/empresa/parametro/entities/parametro.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

@Injectable()
export class ContextService {
  usuario(): UsuarioEntity {
    return RequestContext.currentContext.req['usuario'];
  }

  empresa(): EmpresaEntity {
    return RequestContext.currentContext.req['empresa'];
  }

  empresaId(): number {
    return RequestContext.currentContext.req['empresa'].id;
  }

  data(): Date {
    return RequestContext.currentContext.req['empresa'].data;
  }

  parametros(): EmpresaParametroEntity[] {
    return RequestContext.currentContext.req['empresa'].parametros;
  }

  operadorId(): number {
    return RequestContext.currentContext.req['usuario'].id;
  }

  request(): Request {
    return RequestContext.currentContext.req as unknown as Request;
  }

  response(): Response {
    return RequestContext.currentContext.res as unknown as Response;
  }
}
