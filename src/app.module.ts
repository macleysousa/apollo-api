import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { OrmModule } from './config/orm.module';
import { ContextModule } from './context/context.module';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { ComponentGuard } from './guards/component.guard';
import { EmpresaAuthGuard } from './guards/empresa-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { InjectRequestInterceptor } from './interceptors/inject-request.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { CaixaModule } from './modules/caixa/caixa.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { ComponentGroupModule } from './modules/componente-grupo/componente-grupo.module';
import { ComponentsModule } from './modules/componente/componente.module';
import { ConsignacaoModule } from './modules/consignacao/consignacao.module';
import { CorModule } from './modules/cor/cor.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { FaturaModule } from './modules/fatura/fatura.module';
import { FormaDePagamentoModule } from './modules/forma-de-pagamento/forma-de-pagamento.module';
import { FuncionarioModule } from './modules/funcionario/funcionario.module';
import { ImportModule } from './modules/import/import.module';
import { MarcaModule } from './modules/marca/marca.module';
import { ParametroModule } from './modules/parametro/parametro.module';
import { PedidoModule } from './modules/pedido/pedido.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { ReferenciaModule } from './modules/referencia/referencia.module';
import { RomaneioModule } from './modules/romaneio/romaneio.module';
import { TabelaDePrecoModule } from './modules/tabela-de-preco/tabela-de-preco.module';
import { TamanhoModule } from './modules/tamanho/tamanho.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    AuthModule,
    ContextModule.forRoot(),
    OrmModule.forRoot(),
    UsuarioModule.forRoot(),
    ComponentsModule.forRoot(),
    ComponentGroupModule.forRoot(),
    ParametroModule.forRoot(),
    EmpresaModule.forRoot(),
    CaixaModule.forRoot(),
    PessoaModule.forRoot(),
    FuncionarioModule.forRoot(),
    FaturaModule.forRoot(),
    MarcaModule.forRoot(),
    CorModule.forRoot(),
    TamanhoModule.forRoot(),
    ReferenciaModule.forRoot(),
    CategoriaModule.forRoot(),
    ProdutoModule.forRoot(),
    TabelaDePrecoModule.forRoot(),
    EstoqueModule.forRoot(),
    FormaDePagamentoModule.forRoot(),
    RomaneioModule.forRoot(),
    ConsignacaoModule.forRoot(),
    PedidoModule.forRoot(),
    ImportModule,
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
