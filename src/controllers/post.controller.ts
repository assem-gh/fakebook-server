import { NextFunction, Request, Response } from 'express';

import { CreatePostSchema, GetAllSchema } from '../schemas/post.schema';
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

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { before, take } = GetAllSchema.parse(req.query);

    const result = await postService.getAllPosts(before, take);

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
