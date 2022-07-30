import { NextFunction, Request, Response } from 'express';

import { CreateCommentSchema } from '../schemas/commentSchema';
import commentService from '../services/comment.service';

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { content, postId } = CreateCommentSchema.parse(req.body);

    const comment = await commentService.createComment({
      ownerId: userId,
      postId,
      content,
    });

    res.status(200).send(comment);
  } catch (err) {
    next(err);
  }
};
