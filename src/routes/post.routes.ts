import { Router } from 'express';

import { createPost, getAll } from '../controllers/post.controller';
import { verifyToken } from '../middlewares/VerifyToken';

const postRouter = Router();

postRouter.post('/', verifyToken, createPost).get('/', getAll);

export default postRouter;
