import {Socket} from 'socket.io';

import notificationService from '../../services/notification.service';
import postService from '../../services/post.service';
import store from '../store';
import {ReceivedData} from '../types';

const onPublish = (socket: Socket) => {
  socket.on('notification/publish', async (data: ReceivedData) => {
    const user = socket.user!;

    if (data.label.startsWith('Post')) {
      const post = await postService.findPost(data.relatedEntityId);
      if (post.owner.id === user.id) return;

      const count = post.likes.length - 1;
      const receiver = post.owner.id;
      const receiverSocketId = store.getSocketId(receiver);

      if (receiverSocketId) {
        const notification = await notificationService.createNotification({
          label: data.label,
          count,
          sender: {id: user.id, ...user.profile, userName: user.userName},
          receiver,
          relatedEntityId: post.id,
        });

        socket.to(receiverSocketId).emit('notification/receive', notification);
      }
    }
  });
};

export default {onPublish};
