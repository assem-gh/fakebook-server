import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { db } from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: db.HOST,
  port: db.PORT,
  username: db.USERNAME,
  password: db.PASSWORD,
  database: db.NAME,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
});
