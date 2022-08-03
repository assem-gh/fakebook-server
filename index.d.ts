import { UserEntity } from './src/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<UserEntity, 'password'>;
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: {
      id: string;
      userName: string;
      firstName: string;
      lastName: string;
    };
  }
}
