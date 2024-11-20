import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import ormConfig from './orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
