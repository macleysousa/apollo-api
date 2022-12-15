import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormConfig from './config/orm.config';
import { InjectRequestInterceptor } from './commons/inject-request.interceptor';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot({ ...ormConfig }), UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectRequestInterceptor,
    },
  ],
})
export class AppModule {}
