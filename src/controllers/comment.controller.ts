import { NextFunction, Request, Response } from 'express';

import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from '../schemas/commentSchema';
import commentService from '../services/comment.service';

export const getPostComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getPostComments(postId);

    res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
};

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

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = UpdateCommentSchema.parse(req.body);
    const { commentId } = req.params;

    const comment = await commentService.updateComment({ commentId, content });

    res.status(200).send(comment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;

    await commentService.deleteComment(commentId);

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};
