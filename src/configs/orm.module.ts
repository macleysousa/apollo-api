import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { ContextModule } from 'src/context/context.module';

import ormConfig from './orm.config';
import { throttler } from './throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ContextModule],
      useFactory: () => ({
        ...throttler,
        errorMessage: 'Muitas solicitações enviadas, por favor evite enviar muitas solicitações em um curto período de tempo',
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ormConfig,
      dataSourceFactory: async (options) => addTransactionalDataSource(new DataSource(options)),
    }),
  ],
})
export class OrmModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: this,
    };
  }
}
