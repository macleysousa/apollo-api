import { Injectable } from '@nestjs/common';
import { RequestContext } from 'nestjs-easy-context';

import { LoggedRequest } from 'src';
import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { EmpresaParametroView } from 'src/modules/empresa/parametro/views/paramentro.view';
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

  parametros(): EmpresaParametroView[] {
    return RequestContext.currentContext.req['parametros'];
  }

  operadorId(): number {
    return RequestContext.currentContext.req['usuario'].id;
  }

  request(): LoggedRequest {
    return RequestContext.currentContext.req as LoggedRequest;
  }

  response(): Response {
    return RequestContext.currentContext.res as unknown as Response;
  }
}
