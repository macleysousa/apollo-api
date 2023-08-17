import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export const REQUEST_CONTEXT = '_requestContext';

@Injectable()
export class InjectRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    Logger.log(`${request.method} ${request.url}`, 'Router');

    request.body[REQUEST_CONTEXT] = { usuario: request.usuario, params: request.params };

    return next.handle();
  }
}
