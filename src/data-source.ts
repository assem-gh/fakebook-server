import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { db } from './config';
import { Comment } from './entities/Comment.entity';
import { NotificationEntity } from './entities/Notification.entity';
import { PostEntity } from './entities/post.entity';
import { ProfileEntity } from './entities/profile.entity';
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
  entities: [
    UserEntity,
    PostEntity,
    Comment,
    NotificationEntity,
    ProfileEntity,
  ],
  migrations: [process.cwd() + '/src/migrations/*.ts'],
  subscribers: [],
});
