import { NextFunction, Request, Response } from 'express';

import {
  CreatePostSchema,
  GetAllSchema,
  UpdatePostSchema,
} from '../schemas/post.schema';
import cloudinaryService from '../services/cloudinary.service';
import postService from '../services/post.service';

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = CreatePostSchema.parse(req.body);
    const owner = req.user?.id as string;
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
    const { before, limit, group, offset } = GetAllSchema.parse(req.query);
    const userId = req.user?.id!;
    let posts: any;

    if (group === 'feeds')
      posts = await postService.getFeeds(before || new Date(), limit);
    else posts = await postService.getUserPosts({ offset, group, userId });

    res.status(200).send(posts);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, links, id } = UpdatePostSchema.parse(req.body);
    const owner = req.user?.id as string;

    const uploadedImages = await cloudinaryService.upload(req.files, owner);

    const images = [...links, ...uploadedImages];

    const post = await postService.updatePost({
      content,
      images,
      id,
    });

    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id as string;
    const { postId } = req.params;

    const post = await postService.likePost(userId, postId);

    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;

    await postService.deletePost(postId);

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const savePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id as string;

    const post = await postService.savePost(postId, userId);
    res.status(200).send(post);
  } catch (err) {
    next(err);
  }
};
