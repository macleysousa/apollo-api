import { DataSource, DataSourceOptions } from 'typeorm';

import ormConfig from './src/config/orm.config';

const dataSource = new DataSource({
  ...(ormConfig as DataSourceOptions),
  migrationsRun: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});

export default dataSource;
