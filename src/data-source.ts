import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { db } from './config';
import { Comment } from './entities/Comment.entity';
import { PostEntity } from './entities/post.entity';
import { PostSubscriber } from './entities/post.subscriber';
import { UserEntity } from './entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: db.HOST,
  port: db.PORT,
  username: db.USERNAME,
  password: db.PASSWORD,
  database: db.NAME,
  synchronize: false,
  logging: false,
  entities: [UserEntity, PostEntity, Comment],
  migrations: [process.cwd() + '/src/migrations/*.ts'],
  subscribers: [PostSubscriber],
});
