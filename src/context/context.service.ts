import { RequestContext } from 'nestjs-easy-context';
import { Injectable, Scope } from '@nestjs/common';
import { LoggedRequest } from 'src';

import { EmpresaEntity } from 'src/modules/empresa/entities/empresa.entity';
import { EmpresaParametroView } from 'src/modules/empresa/parametro/views/parametro.view';
import { PessoaUsuario } from 'src/modules/pessoa-usuario/entities/pessoa-usuario.entity';
import { UsuarioEntity } from 'src/modules/usuario/entities/usuario.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class ContextService {
  usuario(): UsuarioEntity {
    return RequestContext.currentContext.req['usuario'];
  }

  usuarioId(): number {
    return RequestContext.currentContext.req['usuario'].id;
  }

  pessoa(): PessoaUsuario {
    return RequestContext.currentContext.req['pessoa'];
  }

  pessoaId(): string {
    return RequestContext.currentContext.req['pessoa'].id;
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
