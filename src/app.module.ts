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
import { ComponentGroupModule } from './modules/componente-grupo/componente-grupo.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { CorModule } from './modules/cor/cor.module';
import { TamanhoModule } from './modules/tamanho/tamanho.module';
import { ReferenciaModule } from './modules/referencia/referencia.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { MarcaModule } from './modules/marca/marca.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { EmpresaAuthGuard } from './guards/empresa-auth.guard';
import { VendedorModule } from './modules/vendedor/vendedor.module';
import { ParametroModule } from './modules/parametro/parametro.module';
import { CaixaModule } from './modules/caixa/caixa.module';
import { ContextModule } from './context/context.module';
import { FormaDePagamentoModule } from './modules/forma-de-pagamento/forma-de-pagamento.module';

@Module({
  imports: [
    AuthModule,
    ContextModule.forRoot(),
    TypeOrmModule.forRoot({ ...ormConfig }),
    UsuarioModule.forRoot(),
    ComponentsModule.forRoot(),
    ComponentGroupModule.forRoot(),
    ParametroModule.forRoot(),
    EmpresaModule.forRoot(),
    CaixaModule.forRoot(),
    MarcaModule.forRoot(),
    CorModule.forRoot(),
    TamanhoModule.forRoot(),
    ReferenciaModule.forRoot(),
    CategoriaModule.forRoot(),
    ProdutoModule.forRoot(),
    PessoaModule,
    VendedorModule,
    FormaDePagamentoModule,
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
      provide: APP_GUARD,
      useClass: EmpresaAuthGuard,
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
