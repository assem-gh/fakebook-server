import { Router } from 'express';

import {
  createPost,
  getAll,
  likePost,
  updatePost,
} from '../controllers/post.controller';
import { verifyToken } from '../middlewares/VerifyToken';

const postRouter = Router();

postRouter.get('/', getAll).post('/', verifyToken, createPost);

postRouter
  .route('/:postId')
  .patch(verifyToken, likePost)
  .put(verifyToken, updatePost);

export default postRouter;
