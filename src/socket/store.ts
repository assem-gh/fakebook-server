interface ConnectedUser {
  sid: string;
  connectedAt: string;
}

const connectedUsers = new Map<string, ConnectedUser>();

const addNewSocket = ({ socketId, userId }) => {
  const newSocketConnection = {
    sid: socketId,
    connectedAt: new Date().toISOString(),
  };
  connectedUsers.set(userId, newSocketConnection);
};

const removeSocket = (userId: string) => {
  connectedUsers.delete(userId);
};

const getSocketId = (userId: string) => {
  return connectedUsers.get(userId)?.sid;
};

const getTotalUsers = () => connectedUsers.size;
export default {
  addNewSocket,
  removeSocket,
  getSocketId,
  getTotalUsers,
};
