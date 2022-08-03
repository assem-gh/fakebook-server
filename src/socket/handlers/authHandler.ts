import { Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { serverConfig } from '../../config';
import userService from '../../services/user.service';

type SocketNextFunc = (err?: Error) => void;

export default async (socket: Socket, next: SocketNextFunc) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error('Unauthorized, Access is denied ');

    const decodedToken = jwt.verify(
      token,
      serverConfig.JWT_SECRET
    ) as JwtPayload;

    const { id, firstName, lastName, userName } = await userService.findUser(
      decodedToken.id
    );
    socket.user = { id, firstName, lastName, userName };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError')
      next(new Error('Unauthorized, Access is denied '));

    next(err);
  }
};
