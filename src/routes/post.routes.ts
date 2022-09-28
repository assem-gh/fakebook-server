import { Router } from 'express';

import {
  createPost,
  getAll,
  likePost,
  updatePost,
  deletePost,
  savePost,
} from '../controllers/post.controller';
import { verifyToken } from '../middlewares/VerifyToken';
import commentRouter from './comment.routes';

const postRouter = Router();

postRouter.use('/:postId/comments', commentRouter);

postRouter.get('/', verifyToken, getAll).post('/', verifyToken, createPost);

postRouter
  .route('/:postId')
  .patch(verifyToken, likePost)
  .put(verifyToken, updatePost)
  .delete(verifyToken, deletePost)
  .post(verifyToken, savePost);

export default postRouter;
