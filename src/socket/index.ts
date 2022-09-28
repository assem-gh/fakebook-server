import {Server as HTTPServer} from 'http';
import {Server, Socket} from 'socket.io';

import connectionHandlers from './handlers/connectionHandlers';
import authHandler from './handlers/authHandler';
import {serverConfig} from '../config';
import notificationHandlers from './handlers/notificationHandlers';

export const initSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [serverConfig.CLIENT_URL],
    },
  });

  io.use(authHandler).on('connection', (socket: Socket) => {
    connectionHandlers.addNewConnection(socket);
    notificationHandlers.onPublish(socket);
    connectionHandlers.onDisconnect(socket);
  });
};
