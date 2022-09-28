import { NextFunction, Request, Response } from 'express';

import notificationService from '../services/notification.service';

export const updateNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.updateNotification(
      notificationId
    );

    res.status(200).send(notification);
  } catch (err) {
    next(err);
  }
};
