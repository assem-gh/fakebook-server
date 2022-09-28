import { AppDataSource } from '../data-source';
import { NotificationEntity } from '../entities/Notification.entity';
import { NewNotification } from '../socket/types';
import { HttpError } from '../utils/HttpError';

const notificationRepo = AppDataSource.getRepository(NotificationEntity);

const createNotification = async ({
  relatedEntityId,
  receiver,
  sender,
  label,
  count,
}: NewNotification) => {
  const notificationData = {
    sender,
    relatedEntityId,
    count,
  };

  const newNotification = notificationRepo.create({
    data: notificationData,
    label: label,
    user: { id: receiver } as any,
  });

  return await notificationRepo.save(newNotification);
};

const updateNotification = async (id: string) => {
  const notification = await notificationRepo.findOne({ where: { id } });
  if (!notification) throw new HttpError(401, 'Notification not found');

  notification.isRead = true;
  await notificationRepo.save(notification);

  return notification;
};

const getAll = async (id: string) => {
  const notifications = await notificationRepo.find({
    where: { user: { id } },
    order: { updatedAt: 'asc' },
    take: 10,
  });

  return notifications;
};

export default { createNotification, updateNotification, getAll };
