import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormConfig from './config/orm.config';
import { InjectRequestInterceptor } from './commons/inject-request.interceptor';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { UserModule } from './modules/user/user.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ComponentsModule } from './modules/components/components.module';

@Module({
    imports: [TypeOrmModule.forRoot({ ...ormConfig }), AuthModule, UserModule, ComponentsModule],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
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
