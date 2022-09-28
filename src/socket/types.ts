export enum NotificationLabel {
  Like = 'Post/like',
  Comment = 'Post/comment',
}

interface Sender {
  id: string;
  profileImage: string;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface NotificationData {
  relatedEntityId: string;
  count?: number;
  sender: Sender;
}

export interface NewNotification {
  label: NotificationLabel;
  relatedEntityId: string;
  receiver: string;
  sender: Sender;
  count?: number;
}

export interface ReceivedData {
  relatedEntityId: string;
  label: NotificationLabel;
}
