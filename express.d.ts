import { Request } from 'express';
import { UserEntity } from './src/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user: UserEntity;
  }
}
