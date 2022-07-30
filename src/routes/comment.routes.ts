import { Router } from 'express';

import { createComment } from '../controllers/comment.controller';
import { verifyToken } from '../middlewares/VerifyToken';

const commentRouter = Router();

commentRouter.post('/', verifyToken, createComment);

export default commentRouter;
