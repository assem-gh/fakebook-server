import { Router } from 'express';

import {
  createComment,
  deleteComment,
  getPostComments,
  updateComment,
} from '../controllers/comment.controller';
import { verifyToken } from '../middlewares/VerifyToken';

const commentRouter = Router({ mergeParams: true });

commentRouter.route('/').post(verifyToken, createComment).get(getPostComments);

commentRouter
  .route('/:commentId')
  .delete(verifyToken, deleteComment)
  .put(verifyToken, updateComment);

export default commentRouter;
