import { NextFunction, Request, Response } from 'express';

import { CreatePostSchema } from '../schemas/post.schema';
import cloudinaryService from '../services/cloudinary.service';
import postService from '../services/post.service';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = CreatePostSchema.parse(req.body);
    const owner = req.user.id;
    const images = await cloudinaryService.upload(req.files, owner);
    const post = await postService.createPost({ content, owner, images });

    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
};
