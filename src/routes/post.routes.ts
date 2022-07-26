import { Router } from 'express';

import { createPost } from '../controllers/post.controller';
import { verifyToken } from '../middlewares/VerifyToken';

const postRouter = Router();

postRouter.post('/', verifyToken, createPost);

export default postRouter;
