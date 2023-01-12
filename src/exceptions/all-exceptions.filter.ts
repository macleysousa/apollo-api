import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private httpAdapter: AbstractHttpAdapter;

  constructor(adapterHost: HttpAdapterHost) {
    this.httpAdapter = adapterHost.httpAdapter;
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    let httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    httpStatus = exception instanceof EntityNotFoundError ? HttpStatus.NOT_FOUND : httpStatus;

    let responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: this.httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (httpStatus < 500 && httpStatus >= 400) {
      const ex = exception as any;
      if (ex.response) {
        responseBody = ex.response;
        httpStatus = ex.response.statusCode;
        responseBody.path = this.httpAdapter.getRequestUrl(ctx.getRequest());
      }
    }

    /**
     * Report error
     */
    if (httpStatus >= 500) {
      Logger.error(exception, (exception as Error).stack);
    }

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
