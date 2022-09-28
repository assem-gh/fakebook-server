import { Router } from 'express';

import { updateNotification } from '../controllers/notification.controller';
import { verifyToken } from '../middlewares/VerifyToken';

const notificationRouter = Router();

notificationRouter.patch('/:notificationId', verifyToken, updateNotification);

export default notificationRouter;
