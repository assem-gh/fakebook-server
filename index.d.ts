import { UserEntity } from './src/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      userName: string;
      email: string;
      profile: {
        firstName: string;
        lastName: string;
        profileImage: string;
      };
    };
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: {
      id: string;
      userName: string;
      profile: {
        firstName: string;
        lastName: string;
        profileImage: string;
      };
    };
  }
}
