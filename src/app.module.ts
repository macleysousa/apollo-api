import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormConfig from './config/orm.config';
import { InjectRequestInterceptor } from './commons/interceptors/inject-request.interceptor';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { UserModule } from './modules/user/user.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ComponentsModule } from './modules/component/component.module';
import { ComponentGuard } from './guards/component.guard';
import { ComponentGroupModule } from './modules/component-group/component-group.module';
import { BranchModule } from './modules/branch/branch.module';
import { ColorModule } from './modules/color/color.module';
import { SizeModule } from './modules/size/size.module';
import { ReferenceModule } from './modules/reference/reference.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormConfig }),
    AuthModule,
    UserModule,
    ComponentsModule,
    ComponentGroupModule,
    BranchModule,
    ColorModule,
    SizeModule,
    ReferenceModule,
    CategoryModule,
    BrandModule,
  ],
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
      provide: APP_GUARD,
      useClass: ComponentGuard,
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
