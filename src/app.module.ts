import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormConfig from './config/orm.config';
import { InjectRequestInterceptor } from './commons/interceptors/inject-request.interceptor';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ComponentsModule } from './modules/componente/componente.module';
import { ComponentGuard } from './guards/component.guard';
import { ComponentGroupModule } from './modules/component-group/componente-grupo.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { CorModule } from './modules/cor/cor.module';
import { TamanhoModule } from './modules/tamanho/tamanho.module';
import { ReferenciaModule } from './modules/referencia/referencia.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductModule } from './modules/product/product.module';
import { MeasurementUnitModule } from './modules/measurement-unit/measurement-unit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormConfig }),
    UsuarioModule.forRoot(),
    AuthModule,
    ComponentsModule,
    ComponentGroupModule,
    EmpresaModule,
    CorModule,
    TamanhoModule,
    ReferenciaModule,
    CategoryModule,
    BrandModule,
    MeasurementUnitModule,
    ProductModule,
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
