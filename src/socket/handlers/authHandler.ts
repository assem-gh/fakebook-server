import {Socket} from 'socket.io';
import {JwtPayload, verify} from 'jsonwebtoken';

import {serverConfig} from '../../config';
import userService from '../../services/user.service';

type SocketNextFunc = (err?: Error) => void;

export default async (socket: Socket, next: SocketNextFunc) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) throw new Error('Unauthorized, Access is denied ');

        const decodedToken = verify(token, serverConfig.JWT_SECRET) as JwtPayload;
        const {id, userName, profile} = await userService.findUser(decodedToken.id);

        socket.user = {id, userName, profile};
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError')
            next(new Error('Unauthorized, Access is denied '));
        next(err);
    }
};
