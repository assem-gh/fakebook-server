import { Socket } from 'socket.io';

import store from '../store';

const addNewConnection = async (socket: Socket) => {
  store.addNewSocket({
    socketId: socket.id,
    userId: socket.user?.id,
  });

  console.log(
    `[Connected - ${store.getTotalUsers()}]: <<${socket.user?.userName}>>  ${
      socket.user?.id
    }`
  );
};

const onDisconnect = (socket: Socket) => {
  socket.on('disconnect', () => {
    store.removeSocket(socket.user!.id);
    console.log(
      `[Disconnected - ${store.getTotalUsers()} ]:   ${socket.user?.id}`
    );
  });
};

export default { addNewConnection, onDisconnect };
