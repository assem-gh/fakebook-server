export enum NotificationType {
  Like = 'Post/like',
  Comment = 'Post/comment',
}

export interface NotificationData {
  relatedEntityId: string;
  count: number;
  sender: {
    id: string;
    profileImage: string;
    userName: string;
  };
}

export interface CreateNewNotification {
  type: NotificationType;
  count: number;
  relatedEntityId: string;
  receiver: string;
  sender: string;
}
