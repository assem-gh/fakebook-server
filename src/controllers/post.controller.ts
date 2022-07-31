import { NextFunction, Request, Response } from 'express';

import {
  CreatePostSchema,
  GetAllSchema,
  UpdatePostSchema,
} from '../schemas/post.schema';
import cloudinaryService from '../services/cloudinary.service';
import postService from '../services/post.service';
import userService from '../services/user.service';

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

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, links, id } = UpdatePostSchema.parse(req.body);
    const owner = req.user.id;

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
    const userId = req.user.id;
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
    const user = req.user;

    const savedPosts = await userService.savePost(postId, user.id);

    res.status(200).send(savedPosts);
  } catch (err) {
    next(err);
  }
};
