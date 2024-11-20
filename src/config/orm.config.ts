import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const { DB_TYPE, DB_DATABASE, DB_HOSTNAME, DB_USERNAME, DB_ENTITIES, DB_MIGRATIONS } = process.env;

if (!DB_TYPE || !DB_HOSTNAME || !DB_DATABASE || !DB_USERNAME || !DB_ENTITIES || !DB_MIGRATIONS) {
  throw new Error('Database variable DB_* has not been set properly');
}

const { ORM_LOGGING, DB_PASSWORD, DB_PORT, DB_TIMEZONE } = process.env;

export default {
  type: DB_TYPE,
  host: DB_HOSTNAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: +DB_PORT || 3306,
  autoLoadEntities: true,
  synchronize: false,
  logging: ORM_LOGGING === 'true' ? true : false,
  entities: [join(__dirname, DB_ENTITIES)],
  migrations: [join(__dirname, DB_MIGRATIONS)],
  migrationsRun: true,
  timezone: DB_TIMEZONE || '+00:00',
} as TypeOrmModuleOptions;
